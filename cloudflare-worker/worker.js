export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Use the same hostname but tell Cloudflare where to actually connect
    const originUrl = `https://${url.hostname}${url.pathname}${url.search}`;

    const originResponse = await fetch(originUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "manual",
      cf: {
        resolveOverride: "3.82.69.9",
      },
    });

    const contentType = originResponse.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return originResponse;
    }

    const nonceArray = new Uint8Array(16);
    crypto.getRandomValues(nonceArray);
    const nonce = btoa(String.fromCharCode(...nonceArray));

    const cspPolicy = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net`,
      `style-src 'self' 'unsafe-inline' 'nonce-${nonce}' https://fonts.googleapis.com`,
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.admission.edu.vn https://api.galaxyfreedom.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    const response = new Response(originResponse.body, originResponse);
    response.headers.set("Content-Security-Policy", cspPolicy);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("Referrer-Policy", "same-origin");
    response.headers.set(
      "Permissions-Policy",
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
    );
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );

    return new HTMLRewriter()
      .on('meta[name="csp-nonce"]', {
        element(element) {
          element.setAttribute("content", nonce);
        },
      })
      .on('meta[http-equiv="Content-Security-Policy"]', {
        element(element) {
          element.remove();
        },
      })
      .on("script", {
        element(element) {
          if (!element.getAttribute("nonce") && !element.getAttribute("src")) {
            element.setAttribute("nonce", nonce);
          }
        },
      })
      .on("style", {
        element(element) {
          if (!element.getAttribute("nonce")) {
            element.setAttribute("nonce", nonce);
          }
        },
      })
      .transform(response);
  },
};
