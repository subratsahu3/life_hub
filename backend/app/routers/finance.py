from fastapi import APIRouter, HTTPException
from typing import List
from ..database import get_db
from ..schemas import TransactionCreate, BudgetSet

router = APIRouter(prefix="/finance", tags=["Finances & Budgeting"])

@router.get("/transactions")
def get_transactions():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions ORDER BY date DESC, id DESC")
    transactions = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return transactions

@router.post("/transactions")
def add_transaction(tx: TransactionCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO transactions (type, category, amount, description, date)
        VALUES (?, ?, ?, ?, ?)
    """, (tx.type, tx.category, tx.amount, tx.description, tx.date))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (new_id,))
    row = dict(cursor.fetchone())
    conn.close()
    return row

@router.delete("/transactions/{tx_id}")
def delete_transaction(tx_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transactions WHERE id = ?", (tx_id,))
    conn.commit()
    conn.close()
    return {"success": True, "deleted_id": tx_id}

@router.get("/budgets")
def get_budgets():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM budgets ORDER BY category ASC")
    budgets = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return budgets

@router.post("/budgets")
def set_budget(budget: BudgetSet):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO budgets (category, monthly_limit)
        VALUES (?, ?)
        ON CONFLICT(category) DO UPDATE SET monthly_limit = excluded.monthly_limit
    """, (budget.category, budget.monthly_limit))
    conn.commit()
    cursor.execute("SELECT * FROM budgets WHERE category = ?", (budget.category,))
    row = dict(cursor.fetchone())
    conn.close()
    return row

@router.get("/summary")
def get_finance_summary():
    conn = get_db()
    cursor = conn.cursor()

    # Total income & expenses
    cursor.execute("SELECT SUM(amount) FROM transactions WHERE type = 'income'")
    total_income = cursor.fetchone()[0] or 0.0

    cursor.execute("SELECT SUM(amount) FROM transactions WHERE type = 'expense'")
    total_expense = cursor.fetchone()[0] or 0.0

    net_savings = total_income - total_expense
    savings_rate = round((net_savings / total_income * 100), 1) if total_income > 0 else 0.0

    # Category breakdown
    cursor.execute("""
        SELECT category, SUM(amount) as total_spent
        FROM transactions
        WHERE type = 'expense'
        GROUP BY category
    """)
    expense_by_cat = {row["category"]: row["total_spent"] for row in cursor.fetchall()}

    cursor.execute("SELECT * FROM budgets")
    budgets = [dict(r) for r in cursor.fetchall()]

    categories_report = []
    total_budget_limit = 0.0
    for b in budgets:
        cat = b["category"]
        limit = b["monthly_limit"]
        total_budget_limit += limit
        spent = expense_by_cat.get(cat, 0.0)
        percentage = round((spent / limit * 100), 1) if limit > 0 else 0.0
        status = "healthy"
        if percentage >= 100:
            status = "exceeded"
        elif percentage >= 85:
            status = "warning"

        categories_report.append({
            "category": cat,
            "monthly_limit": limit,
            "spent": round(spent, 2),
            "percentage": percentage,
            "status": status
        })

    conn.close()
    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "net_savings": round(net_savings, 2),
        "savings_rate_percent": savings_rate,
        "total_budget_limit": round(total_budget_limit, 2),
        "categories": categories_report
    }
