import { Router, Request, Response } from 'express';
import { query } from '../db/pool.js';

const router = Router();

// GET /api/comments?station_slug=xyz or ?station_id=uuid
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { station_slug, station_id } = req.query;

    if (!station_slug && !station_id) {
      res.status(400).json({ error: 'station_slug or station_id is required' });
      return;
    }

    let sql = `SELECT * FROM comments WHERE `;
    const params: any[] = [];

    if (station_slug && station_id) {
      params.push(station_slug, station_id);
      sql += `(station_slug = $1 OR station_id::text = $2)`;
    } else if (station_slug) {
      params.push(station_slug);
      sql += `station_slug = $1`;
    } else {
      params.push(station_id);
      sql += `station_id::text = $1`;
    }

    sql += ` ORDER BY created_at ASC;`;

    const result = await query(sql, params);
    const allComments = result.rows;

    // Group into threaded hierarchy
    const commentMap = new Map<string, any>();
    const rootComments: any[] = [];

    allComments.forEach((c: any) => {
      commentMap.set(c.id, { ...c, replies: [] });
    });

    allComments.forEach((c: any) => {
      const item = commentMap.get(c.id);
      if (c.parent_id && commentMap.has(c.parent_id)) {
        commentMap.get(c.parent_id).replies.push(item);
      } else {
        rootComments.push(item);
      }
    });

    // Root comments newest first, replies chronological
    rootComments.reverse();

    res.json({
      success: true,
      count: allComments.length,
      comments: rootComments,
    });
  } catch (error: any) {
    console.error('Error fetching station comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/comments (Create comment or reply)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { station_slug, station_id, author_name, content, parent_id } = req.body;

    if (!author_name || !author_name.trim()) {
      res.status(400).json({ error: 'Author name is required' });
      return;
    }

    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Comment content cannot be empty' });
      return;
    }

    if (!station_slug) {
      res.status(400).json({ error: 'Station slug is required' });
      return;
    }

    const cleanAuthor = author_name.trim().slice(0, 80);
    const cleanContent = content.trim().slice(0, 1000);
    const parentIdVal = parent_id ? parent_id : null;
    const stationIdVal = station_id ? station_id : null;

    const insertSql = `
      INSERT INTO comments (station_slug, station_id, author_name, content, parent_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      station_slug,
      stationIdVal,
      cleanAuthor,
      cleanContent,
      parentIdVal,
    ]);

    const created = result.rows[0];
    res.status(201).json({
      success: true,
      comment: {
        ...created,
        replies: [],
      },
    });
  } catch (error: any) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// POST /api/comments/:id/like (Like a comment)
router.post('/:id/like', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE comments SET likes_count = likes_count + 1 WHERE id::text = $1 RETURNING id, likes_count;`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.json({
      success: true,
      id: result.rows[0].id,
      likes_count: result.rows[0].likes_count,
    });
  } catch (error: any) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Failed to like comment' });
  }
});

export default router;
