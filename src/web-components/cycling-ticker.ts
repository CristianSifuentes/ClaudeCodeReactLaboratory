class CyclingNewsTicker extends HTMLElement {
  connectedCallback() {
    const parsed = this.getAttribute('headlines')
    const headlines = parsed ? (JSON.parse(parsed) as string[]) : []

    this.innerHTML = `
      <div style="border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);color:#fff;padding:12px 14px;border-radius:10px;overflow:hidden;white-space:nowrap;">
        <span style="color:#ef5350;font-weight:700;margin-right:10px;">LIVE</span>
        <span class="ticker-track">${headlines.join('  •  ')}</span>
      </div>
    `

    const ticker = this.querySelector('.ticker-track') as HTMLElement | null
    if (ticker) {
      ticker.style.display = 'inline-block'
      ticker.style.animation = 'ticker 18s linear infinite'
      ticker.style.paddingLeft = '100%'
    }
  }
}

if (!customElements.get('cycling-news-ticker')) {
  customElements.define('cycling-news-ticker', CyclingNewsTicker)
}
