import cron from "node-cron";
import pgdb from "./db";
import { Creation } from "./creations/entities/creation.entity";

// every hour, check for all creations still in voting phase
// if threshold is hit, set canon = true
// else, canon = false
cron.schedule("* * * * *", async () => {
  const creations: [Creation] = await pgdb`
        SELECT * FROM creations WHERE is_canon IS NULL AND created_at < NOW() - INTERVAL '1 week';
    `;
  for (const creation of creations) {
    const [rating] = await pgdb`
            SELECT COALESCE(SUM(CASE WHEN is_positive = true THEN 1 WHEN is_positive = false THEN -1 END), 0) AS total FROM ratings WHERE ratings.creation_id = ${creation.id}
        `;
    await pgdb`
            UPDATE creations SET is_canon = ${rating.total >= 10 ? pgdb`true` : pgdb`false`} WHERE id = ${creation.id};
        `;
  }
});
