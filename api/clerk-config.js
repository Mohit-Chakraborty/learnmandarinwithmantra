// Gives the browser the Clerk publishable key for this deployment.
// The key is public by design (it identifies the Clerk app, it can't act for it);
// it lives in a Vercel environment variable so preview and production can differ.
module.exports = (req, res) => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || null;
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.end(JSON.stringify({ publishableKey }));
};
