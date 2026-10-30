Thorvon Media website v3 (static HTML/CSS/JS)

Deploy: this folder is ready for GitHub + Vercel as-is. index.html sits at the root, so upload/commit everything here to the thorvonmedia.in repo (index.html, styles.css, script.js, favicon.ico, og.png, assets/). Vercel serves it as a static site, no build step needed. README.txt and test/ can go along or be left out.

Edit points (script.js, top of file):
- WHATSAPP_LINK: https://wa.me/917002889463 (same number as talent.thorvonmedia.in)
- WEB3FORMS_ACCESS_KEY: the Web3Forms key from the original thorvonmedia.in. Enquiries go to the inbox that key is registered to. To send them to zonack@thorvonmedia.in, make a free key for that address at web3forms.com and paste it here.
- Plans and prices: the PLANS object (Instagram, YouTube, LinkedIn, X, Reddit; $450 / $890 / $1,450 + Custom, from the original site).

If the form can't send, it offers "Send on WhatsApp" with the message filled in.
Test: node --test test/site.test.js
