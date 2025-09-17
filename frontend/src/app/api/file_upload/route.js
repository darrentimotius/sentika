export async function POST(req) {
  try {
    const formData = await req.formData();

    const response = await fetch("http://api.sentika.site/predict_file", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Upload gagal ke API" }),
        { status: response.status }
      );
    }

    // API ngembaliin file CSV
    const blob = await response.blob();
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "text/csv",
        "Content-Disposition": "attachment; filename=hasil_sentimen.csv",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
