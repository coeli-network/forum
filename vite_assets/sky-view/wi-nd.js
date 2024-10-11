customElements.define(
  'wi-nd',
  class extends HTMLElement {
    static get observedAttributes() {
      //
      return [
        'wid',
        'here',
        'searching', // boolean. true is user is using the search bar in the header
        //'strategies', // space-separated list of iframe prefixes
        //'renderer', // current iframe strategy
        // 'menu',
        'dragging',
        'tab-title',
        'favicon'
      ]
    }
    constructor() {
      //
      super()
      const shadow = this.attachShadow({ mode: 'open' })
      this.loadCSS('feather.css').then((sheet) => {
        shadow.adoptedStyleSheets = [sheet]
      })
      this.shadowRoot.innerHTML = `
      <style>
       @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
       .mso,
       .material-symbols-outlined {
         font-family: 'Material Symbols Outlined';
         font-weight: normal;
         font-style: normal;
         font-size: 1em;
         line-height: 1;
         letter-spacing: normal;
         text-transform: none;
         display: inline-block;
         white-space: nowrap;
         word-wrap: normal;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         direction: ltr;
         -webkit-font-feature-settings: 'liga';
         -webkit-font-smoothing: antialiased;
         font-variation-settings:
           'FILL' 0,
           'wght' 400,
           'GRAD' 0,
           'opsz' 24;
       }
       :host {
         position: relative;
         display: flex;
         flex-direction: column;
         width: 100%;
         height: 100%;
         overflow: hidden;
         border-radius: 3px;
         border: var(--sky-window-border, 1px) solid var(--b2);
       }
       #drag-overlay {
         background: blue;
         opacity: 0%;
         width: 100%;
         height: 100%;
         position: absolute;
         top: 0;
         left: 0;
         z-index: 50;
       }
       :host(.dragging) #drag-overlay {
         opacity: 14%;
       }
       @media (max-width: 900px) {
         #axns {
           display: none;
         }
       }
      </style>
      <div id="drag-overlay" class="hidden"></div>
      <header class="b2 fr af js g1">
        <div id="breadcrumbs" class="grow fr g1 af js"></div>
        <form id="searchbar" class="grow fr hidden">
          <input
            id="input-here"
            class="f0 grow b2 br1 p-1 s-1"
            style="outline: none;"
            autocomplete="off"
            spellcheck="false"
          />
        </form>
        <div id="axns" class="fr">
          <button
            class="p1 s-1 b2 hover br1 fc jc ac"
            onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('minimize'))"
            >
            <span class="mso">minimize</span>
          </button>
          <button
            class="p1 s-1 b2 hover br1 fc jc ac"
            onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('close'))"
            >
            <span class="mso">close</span>
          </button>
          <button
            class="p1 s-1 b2 hover br1 fc jc ac"
            id="copy-pith"
            >
            <span class="mso">content_copy</span>
          </button>
          <div
            class="p1 s-1 b2 grabber f4 fc jc ac"
            draggable="true"
            id="dragger"
            >
            <span class="mso">drag_indicator</span>
          </div>
        </div>
      </header>
      <div id="tabs" class="fc grow">
      </div>
    `
      this.intervalId = null
    }
    async loadCSS(url) {
      const response = await fetch(url)
      const cssText = await response.text()
      const sheet = new CSSStyleSheet()
      await sheet.replace(cssText)
      return sheet
    }

    connectedCallback() {
      this.rebuildIframe()
      $(this.gid('searchbar')).off()
      $(this.gid('searchbar')).on('submit', (e) => {
        e.preventDefault()
        let here = $(this.gid('input-here')).val()
        this.setAttribute('here', here)
        this.rebuildIframe()
      })
      $(this.gid('input-here')).off()
      $(this.gid('input-here')).on('focusout', (e) => {
        $(this).removeAttr('searching')
      })
      $(this.gid('input-here')).on('blur', (e) => {
        $(this).removeAttr('searching')
      })

      $(this.gid('dragger')).off()
      $(this.gid('dragger')).on('dragstart', (e) => {
        e.originalEvent.dataTransfer.setData(
          'text/plain',
          this.getAttribute('wid')
        )
      })
      $(this.gid('dragger')).on('dragenter', (e) => {
        $(this).trigger('drag-start')
      })
      $(this.gid('dragger')).on('dragend', (e) => {
        $(this).trigger('drag-end')
      })
      $(this.gid('dragger')).off()
      $(this.gid('dragger')).on('dragstart', (e) => {
        e.originalEvent.dataTransfer.setData(
          'text/plain',
          this.getAttribute('wid')
        )
      })
      $(this.gid('dragger')).on('dragenter', (e) => {
        $(this).trigger('drag-start')
      })
      $(this.gid('dragger')).on('dragend', (e) => {
        $(this).trigger('drag-end')
      })

      $(this).off()
      $(this).on('close', () => {
        $(this).trigger('close-window')
      })
      $(this).on('minimize', () => {
        $(this).trigger('minimize-window')
      })
      $(this.gid('copy-pith')).on('click', async (e) => {
        let here = this.getAttribute('here')
        try {
          await navigator.clipboard.writeText(here)
        } catch (err) {
          console.error('Failed to copy text: ', err)
        }
      })
      $(this).on('dragenter', (e) => {
        $(this).addClass('dragging')
      })
      $(this).on('dragover', (e) => {
        e.preventDefault()
      })
      $(this).on('dragleave', (e) => {
        $(this).removeClass('dragging')
      })
      $(this).on('drop', (e) => {
        e.preventDefault()
        $(this).trigger('drag-end')
        let wid = e.originalEvent.dataTransfer.getData('text/plain')
        let wind = $(`[wid='${wid}']`)
        let newSlot = parseInt(this.getAttribute('slot').slice(1))
        let oldSlot = parseInt(wind.attr('slot')?.slice(1))
        if (!isNaN(oldSlot) && oldSlot < newSlot) {
          newSlot = newSlot + 0.5
        } else {
          newSlot = newSlot - 0.5
        }
        wind.attr('slot', `s${newSlot}`)
        $(this).trigger('fix-slots')
      })
      this.setAttribute('wid', `${Date.now()}`)

      // poll iframes for changes every 350ms
      this.intervalId = setInterval(() => {
        let here = this.getAttribute('here')
        let favicon = this.getAttribute('favicon')
        let tabTitle = this.getAttribute('tab-title')
        $(this.gid('tabs'))
          .children()
          .each(function () {
            if (this.contentWindow) {
              this.contentWindow.postMessage({
                messagetype: 'sky-poll',
                here,
                favicon,
                tabTitle
              })
            }
          })
      }, 350)

      $(this).on('title-changed', (e) => {
        if (!!e.detail) {
          $(this).attr('tab-title', e.detail)
        } else {
          $(this).attr('tab-title', null)
        }
        $(this).trigger('here-moved')
      })
      $(this).on('favicon-changed', (e) => {
        if (!!e.detail) {
          $(this).attr('favicon', e.detail)
        } else {
          $(this).attr('favicon', null)
        }
        $(this).trigger('here-moved')
      })
      $(this).on('iframe-moved', (e) => {
        console.log('iframe moved', e.detail.here)
        $(this).attr('here', e.detail.here)
      })
      $(this).on('set-feather-values', (e) => {
        $(this.gid('tabs'))
          .children()
          .each(function () {
            this.contentWindow.postMessage({
              messagetype: 'feather-change',
              rules: e.detail
            })
          })
      })
      $(this).on('reset-feather-values', (e) => {
        $(this.gid('tabs'))
          .children()
          .each(function () {
            this.contentWindow.postMessage({
              messagetype: 'feather-reset'
            })
          })
      })
    }
    disconnectedCallback() {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    }
    attributeChangedCallback(name, oldValue, newValue) {
      //
      if (name === 'here') {
        if (this.shadowRoot) {
          if (newValue !== '') {
            this.buildBreadcrumbs()
            $(this.gid('input-here')).val(newValue)
            $(this).trigger('here-moved')
          }
        }
      } else if (name === 'searching') {
        if (newValue === null) {
          $(this.gid('breadcrumbs')).removeClass('hidden')
          $(this.gid('searchbar')).addClass('hidden')
        } else {
          $(this.gid('breadcrumbs')).addClass('hidden')
          $(this.gid('searchbar')).removeClass('hidden')
          this.gid('input-here').focus()
          this.gid('input-here').setSelectionRange(999, 999)
        }
      } else if (name === 'dragging') {
        if (newValue === null) {
          $(this).removeClass('dragging')
          $(this.gid('drag-overlay')).addClass('hidden')
        } else {
          $(this.gid('drag-overlay')).removeClass('hidden')
        }
      }
    }
    qs(sel) {
      return this.shadowRoot.querySelector(sel)
    }
    gid(id) {
      return this.shadowRoot.getElementById(id)
    }
    get here() {
      return this.getAttribute('here') || '/'
    }
    get path() {
      return this.here
        .slice(1)
        .split('/')
        .filter((s) => !!s.trim().length)
    }

    // get strategyPoke() {
    //   let poke = {
    //     here: this.here,
    //     strategies: this.strategies.slice(0, -1)
    //   }
    //   return JSON.stringify(poke)
    // }

    async checkUrl(url) {
      try {
        let response = await fetch(url, { method: 'GET' })
        if (response.ok) {
          if (response.redirected) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      } catch (error) {
        console.error('Fetch error:', error, url)
        return false
      }
    }
    createIframe(here, open) {
      let el = document.createElement('iframe')
      el.setAttribute('lazy', '')
      el.setAttribute('src', here)
      el.setAttribute(
        'style',
        'width: 100%; flex-grow: 1; border: none; background: var(--b0);'
      )
      if (!open) {
        el.hidden = true
      }
      el.addEventListener('load', () => {
        this.registerServiceWorker(el)
      })
      return el
    }
    rebuildIframe() {
      let here = this.here
      //let isLoading = await this.checkUrl(url)
      let isLoading = true
      if (isLoading) {
        $(this.gid('tabs')).children().remove()
        let frame = this.createIframe(here, true)
        $(this.gid('tabs')).append(frame)
      } else {
        console.log('404')
      }
    }
    registerServiceWorker(iframe) {
      //  for convenience, this part is inject by wi-nd.
      //  in future, due to the need to sandbox the iframes,
      //  this must be provided by the iframe's contents.
      const iframeDoc = iframe.contentWindow.document
      let wid = this.getAttribute('wid')
      const inlineScript = iframeDoc.createElement('script')
      inlineScript.textContent = `
      window.parent.postMessage(
        {
          messagetype: 'iframe-wants-feather',
          wid: '${wid}',
        }, '*'
      );
      window.addEventListener('message', (event) => {
        if (event.data?.messagetype === 'sky-poll') {
          let windowHere = event.data.here;
          let here = window.location.pathname;
          if (here != windowHere) {
            window.parent.postMessage({
              messagetype: 'sky-poll-response',
              wid: '${wid}',
              here: here
            }, '*');
          }

          let windowFavicon = event.data.favicon || "";
          let faviconEl = document.querySelector('link[rel="icon"]');
          let favicon;
          if (faviconEl) {
            favicon = new URL(faviconEl.href, document.baseURI).href;
          } else {
            favicon = "";
          }
          if (favicon != windowFavicon) {
            window.parent.postMessage({
              messagetype: 'sky-poll-response-favicon',
              wid: '${wid}',
              favicon: favicon,
            }, '*');
          }

          let windowTitle = event.data.tabTitle || "";
          let title = document.title || "";
          if (title != windowTitle) {
            window.parent.postMessage({
              messagetype: 'sky-poll-response-title',
              wid: '${wid}',
              tabTitle: title,
            }, '*');
          }

        }
        else if (event.data?.messagetype === 'feather-change') {
          event.data.rules.forEach(r => {
            document.documentElement.style
              .setProperty(
                '--'+r.variable,
                r.value+r.unit,
              );
          })
        }
        else if (event.data?.messagetype === 'feather-reset') {
          document.documentElement.style = '';
        }
      });
    `
      iframeDoc.body.appendChild(inlineScript)
    }
    breakUrl(url) {
      const urlObj = new URL(url)
      const base = `${urlObj.protocol}//${urlObj.host}`
      const pathParts = urlObj.pathname.split('/').filter((part) => part !== '')

      const result = [base]
      for (let part of pathParts) {
        result.push(`/${part}`)
      }
      return result
    }
    urbitPath(path) {
      console.log(path.slice(1).split('/'))
      return path.slice(1).split('/')
    }
    buildBreadcrumbs() {
      let breadcrumbs = $(this.gid('breadcrumbs'))

      breadcrumbs.children().remove()

      let path = this.here.startsWith('/~')
        ? this.urbitPath(this.here)
        : this.breakUrl(this.here)
      //
      path.forEach((p, i) => {
        let chevron = $(document.createElement('span'))
        chevron.addClass('s-2 f4 o6 fc ac jc no-select')
        if (i > 0) {
          chevron.text('›')
        }
        breadcrumbs.append(chevron)
        //
        let crumb = $(document.createElement('button'))
        crumb.addClass((i === 0 ? 'p-1' : 'p1') + ' b2 hover br1 s-1 f2')
        //crumb.text(i === 0 && path[0].startsWith('~') ? '/' : path[i])
        crumb.text(path[i])
        crumb.on('click', () => {
          $(this).attr('here', '/' + path.slice(0, i + 1).join('/'))
          this.rebuildIframe()
        })
        breadcrumbs.append(crumb)
      })
      let spacer = $(document.createElement('button'))
      spacer.addClass('grow b2 br1 hover')
      spacer.on('click', () => {
        $(this).attr('searching', '')
      })
      breadcrumbs.append(spacer)
    }
  }
)
