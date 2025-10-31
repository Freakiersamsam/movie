// Admin routes for movie management

/**
 * GET /api/admin/movies
 * List all movies
 */
export async function getAllMovies(request, env) {
  try {
    const url = new URL(request.url);
    const difficulty = url.searchParams.get('difficulty');
    const search = url.searchParams.get('search');

    let query = 'SELECT * FROM movies';
    const params = [];
    const conditions = [];

    if (difficulty) {
      conditions.push('difficulty = ?');
      params.push(parseInt(difficulty, 10));
    }

    if (search) {
      conditions.push('(title LIKE ? OR actor1 LIKE ? OR actor2 LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY difficulty ASC, title ASC';

    const result = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      movies: result.results,
      count: result.results.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in getAllMovies:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get movies',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/admin/movies/:id
 * Get a single movie by ID
 */
export async function getMovie(request, env, id) {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM movies WHERE id = ?'
    ).bind(parseInt(id, 10)).first();

    if (!result) {
      return new Response(JSON.stringify({
        error: 'Movie not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in getMovie:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get movie',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/admin/movies
 * Add a new movie
 */
export async function addMovie(request, env) {
  try {
    const movie = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'year', 'difficulty', 'quote1', 'quote2', 'actor1', 'actor2'];
    for (const field of requiredFields) {
      if (!movie[field]) {
        return new Response(JSON.stringify({
          error: `Missing required field: ${field}`
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Validate difficulty (1-5)
    if (movie.difficulty < 1 || movie.difficulty > 5) {
      return new Response(JSON.stringify({
        error: 'Difficulty must be between 1 and 5'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if movie already exists
    const existing = await env.DB.prepare(
      'SELECT id FROM movies WHERE title = ?'
    ).bind(movie.title).first();

    if (existing) {
      return new Response(JSON.stringify({
        error: 'Movie with this title already exists',
        existingId: existing.id
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert movie
    const result = await env.DB.prepare(`
      INSERT INTO movies (title, year, difficulty, quote1, quote2, actor1, actor2)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      movie.title,
      parseInt(movie.year, 10),
      parseInt(movie.difficulty, 10),
      movie.quote1,
      movie.quote2,
      movie.actor1,
      movie.actor2
    ).run();

    if (!result.success) {
      throw new Error('Failed to insert movie');
    }

    // Get the inserted movie
    const inserted = await env.DB.prepare(
      'SELECT * FROM movies WHERE id = ?'
    ).bind(result.meta.last_row_id).first();

    return new Response(JSON.stringify({
      success: true,
      movie: inserted
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in addMovie:', error);
    return new Response(JSON.stringify({
      error: 'Failed to add movie',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * PUT /api/admin/movies/:id
 * Update an existing movie
 */
export async function updateMovie(request, env, id) {
  try {
    const movie = await request.json();

    // Check if movie exists
    const existing = await env.DB.prepare(
      'SELECT id FROM movies WHERE id = ?'
    ).bind(parseInt(id, 10)).first();

    if (!existing) {
      return new Response(JSON.stringify({
        error: 'Movie not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (movie.title !== undefined) {
      updates.push('title = ?');
      params.push(movie.title);
    }
    if (movie.year !== undefined) {
      updates.push('year = ?');
      params.push(parseInt(movie.year, 10));
    }
    if (movie.difficulty !== undefined) {
      if (movie.difficulty < 1 || movie.difficulty > 5) {
        return new Response(JSON.stringify({
          error: 'Difficulty must be between 1 and 5'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      updates.push('difficulty = ?');
      params.push(parseInt(movie.difficulty, 10));
    }
    if (movie.quote1 !== undefined) {
      updates.push('quote1 = ?');
      params.push(movie.quote1);
    }
    if (movie.quote2 !== undefined) {
      updates.push('quote2 = ?');
      params.push(movie.quote2);
    }
    if (movie.actor1 !== undefined) {
      updates.push('actor1 = ?');
      params.push(movie.actor1);
    }
    if (movie.actor2 !== undefined) {
      updates.push('actor2 = ?');
      params.push(movie.actor2);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({
        error: 'No fields to update'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(parseInt(id, 10));

    const query = `UPDATE movies SET ${updates.join(', ')} WHERE id = ?`;
    const result = await env.DB.prepare(query).bind(...params).run();

    if (!result.success) {
      throw new Error('Failed to update movie');
    }

    // Get the updated movie
    const updated = await env.DB.prepare(
      'SELECT * FROM movies WHERE id = ?'
    ).bind(parseInt(id, 10)).first();

    return new Response(JSON.stringify({
      success: true,
      movie: updated
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in updateMovie:', error);
    return new Response(JSON.stringify({
      error: 'Failed to update movie',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * DELETE /api/admin/movies/:id
 * Delete a movie
 */
export async function deleteMovie(request, env, id) {
  try {
    // Check if movie exists
    const existing = await env.DB.prepare(
      'SELECT id, title FROM movies WHERE id = ?'
    ).bind(parseInt(id, 10)).first();

    if (!existing) {
      return new Response(JSON.stringify({
        error: 'Movie not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the movie
    const result = await env.DB.prepare(
      'DELETE FROM movies WHERE id = ?'
    ).bind(parseInt(id, 10)).run();

    if (!result.success) {
      throw new Error('Failed to delete movie');
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Movie "${existing.title}" deleted successfully`,
      deletedId: existing.id
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in deleteMovie:', error);
    return new Response(JSON.stringify({
      error: 'Failed to delete movie',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
