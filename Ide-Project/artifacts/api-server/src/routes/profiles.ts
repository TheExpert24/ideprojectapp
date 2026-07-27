import { Router, type IRouter } from "express";
import { client } from "../lib/db";

const router: IRouter = Router();

// GET /api/profile/:userId
router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) { res.status(400).json({ error: "userId required" }); return; }
  try {
    const rows = await client`
      SELECT id, name, bio, location, role, onboarding_complete,
             saved_resources, saved_news, updated_at
      FROM profiles WHERE id = ${userId} LIMIT 1
    `;
    if (rows.length === 0) { res.status(404).json({ error: "not_found" }); return; }
    res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "profile fetch error");
    res.status(500).json({ error: "server_error" });
  }
});

// PUT /api/profile/:userId — upsert full profile
router.put("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) { res.status(400).json({ error: "userId required" }); return; }

  const {
    name = "",
    bio = "",
    location = "",
    role = null,
    onboarding_complete = false,
    saved_resources = [],
    saved_news = [],
  } = req.body ?? {};

  try {
    const rows = await client`
      INSERT INTO profiles
        (id, name, bio, location, role, onboarding_complete, saved_resources, saved_news, updated_at)
      VALUES
        (${userId}, ${name}, ${bio}, ${location}, ${role}, ${onboarding_complete},
         ${saved_resources}, ${saved_news}, now())
      ON CONFLICT (id) DO UPDATE SET
        name                = EXCLUDED.name,
        bio                 = EXCLUDED.bio,
        location            = EXCLUDED.location,
        role                = EXCLUDED.role,
        onboarding_complete = EXCLUDED.onboarding_complete,
        saved_resources     = EXCLUDED.saved_resources,
        saved_news          = EXCLUDED.saved_news,
        updated_at          = now()
      RETURNING id, name, bio, location, role, onboarding_complete,
                saved_resources, saved_news, updated_at
    `;
    res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "profile upsert error");
    res.status(500).json({ error: "server_error" });
  }
});

export default router;
