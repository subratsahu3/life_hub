from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..database import get_db
from ..schemas import CommunityPostCreate, CommunityPostStatusUpdate

router = APIRouter(prefix="/community", tags=["Community Services"])

@router.get("/posts")
def get_posts(type: Optional[str] = None, status: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    query = "SELECT * FROM community_posts WHERE 1=1"
    params = []
    if type:
        query += " AND type = ?"
        params.append(type)
    if status:
        query += " AND status = ?"
        params.append(status)
    query += " ORDER BY id DESC"

    cursor.execute(query, params)
    posts = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return posts

@router.post("/posts")
def create_post(post: CommunityPostCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO community_posts (type, title, description, author_name, contact, location, karma_offered)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (post.type, post.title, post.description, post.author_name, post.contact, post.location, post.karma_offered))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM community_posts WHERE id = ?", (new_id,))
    row = dict(cursor.fetchone())
    conn.close()
    return row

@router.patch("/posts/{post_id}/status")
def update_post_status(post_id: int, status_update: CommunityPostStatusUpdate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM community_posts WHERE id = ?", (post_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Community post not found")

    cursor.execute("UPDATE community_posts SET status = ? WHERE id = ?", (status_update.status, post_id))
    conn.commit()
    cursor.execute("SELECT * FROM community_posts WHERE id = ?", (post_id,))
    updated = dict(cursor.fetchone())
    conn.close()
    return updated

@router.delete("/posts/{post_id}")
def delete_post(post_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM community_posts WHERE id = ?", (post_id,))
    conn.commit()
    conn.close()
    return {"success": True, "deleted_id": post_id}

@router.get("/summary")
def get_community_summary():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM community_posts WHERE status = 'open'")
    active_posts = cursor.fetchone()[0] or 0

    cursor.execute("SELECT COUNT(*) FROM community_posts WHERE type = 'lend_borrow' AND status = 'open'")
    items_to_borrow = cursor.fetchone()[0] or 0

    cursor.execute("SELECT COUNT(*) FROM community_posts WHERE type = 'volunteer' AND status = 'open'")
    volunteer_ops = cursor.fetchone()[0] or 0

    cursor.execute("SELECT SUM(karma_offered) FROM community_posts WHERE status = 'completed'")
    total_karma_awarded = (cursor.fetchone()[0] or 0) + 85  # Baseline goodwill points

    conn.close()
    return {
        "active_posts": active_posts,
        "items_available_to_borrow": items_to_borrow,
        "volunteer_opportunities": volunteer_ops,
        "community_karma_points": total_karma_awarded
    }
