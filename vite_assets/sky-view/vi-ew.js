import * as ob from "urbit-ob";
import * as kg from "urbit-key-generation";

customElements.define(
  "vi-ew",
  class extends HTMLElement {
    static get observedAttributes() {
      //
      return ["our", "open", "windows-open", "default-strategies"];
    }
    constructor() {
      //
      super();
      const shadow = this.attachShadow({ mode: "open" });
      this.loadCSS("feather.css").then((sheet) => {
        shadow.adoptedStyleSheets = [sheet];
      });
      shadow.innerHTML = `
      <style>
       .mso,
       .material-symbols-outlined {
         font-family: 'Material Symbols Outlined', sans-serif;
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
       * {
         box-sizing: border-box;
       }
       :host {
         width: 100%;
         height: 100%;
         max-height: 100%;
         overflow: hidden;
         margin: 0;
         position: relative;
         opacity: var(--sky-opacity, 1);
         padding: var(--sky-outer-gap, 8px);
         background-color: var(--b1);

         display: grid;
         grid-template-columns: 50px auto;
         grid-template-rows: auto 1fr;
         grid-template-areas:
         "tray main"
         "tray main";
       }
       :host(.open) {
         grid-template-columns: 320px auto;
         grid-template-rows: auto 1fr;
         grid-template-areas:
         "tray main"
         "nav main";
       }
       :host(.open) #nav {
         display: flex;
       }
       #nav {
         grid-area: nav;
         display: none;
         flex-direction: column;
         justify-content: flex-start;
         align-items: stretch;
         gap: 12px;
         overflow: auto;
       }
       :host(.open) #tray {
         display: none;
       }
       #tray {
         grid-area: tray;
         display: flex;
         padding-bottom: 15px;
       }
       /*
        *  grid display
        *
        */
       main {
         display: grid;
         grid-area: main;
         overflow: hidden;
         padding-left: var(--sky-inner-gap, 8px);
       }
       #s0, #s1, #s2, #s3 {
         overflow: auto;
       }
       #button {
         grid-area: btn;
         height: fit-content;
       }
       #s-none {
         grid-area: void;
       }
       #s0 {
         grid-area: s0;
       }
       #s1 {
         grid-area: s1;
       }
       #s2 {
         grid-area: s2;
       }
       #s3 {
         grid-area: s3;
       }
       main.open-0 {
         grid-template-columns: 1fr;
         grid-template-rows: 1fr;
         grid-template-areas:
         "void";
       }
       main #s-none {
         display: none;
       }
       main.open-0 #s-none {
         display: flex;
       }
       main #s-login {
         display: none;
       }
       main.open-login #s-login {
         display: flex;
       }
       main.open-login #s-none,
       main.open-login #s0,
       main.open-login #s1,
       main.open-login #s2,
       main.open-login #s3 {
         display: none;
       }
       main.open-0 #s0,
       main.open-0 #s1,
       main.open-0 #s2,
       main.open-0 #s3 {
         display: none;
       }
       main.open-1 {
         grid-template-columns: 1fr;
         grid-template-rows: 1fr;
         grid-template-areas:
         "s0";
       }
       main.open-1 #s0 {
         display: block;
       }
       main.open-1 #s1,
       main.open-1 #s2,
       main.open-1 #s3 {
         display: none;
       }
       main.open-2 {
         grid-template-columns: 1fr 1fr;
         grid-template-rows: 1fr;
         grid-template-areas:
         "s0 s1";
       }
       main.open-2 #s0,
       main.open-2 #s1 {
         display: block;
       }
       main.open-2 #s2,
       main.open-2 #s3 {
         display: none;
       }
       main.open-3 {
         grid-template-columns: 1fr 1fr;
         grid-template-rows: 1fr 1fr;
         grid-template-areas:
         "s0 s1"
         "s0 s2";
       }
       main.open-3 #s0,
       main.open-3 #s1,
       main.open-3 #s2 {
         display: block;
       }
       main.open-3 #s3 {
         display: none;
       }
       main.open-4 {
         grid-template-columns: 2fr 1fr 1fr;
         grid-template-rows: 1fr 1fr;
         grid-template-areas:
         "s0 s1 s1"
         "s0 s2 s3";
       }
       main.open-4 #s0,
       main.open-4 #s1,
       main.open-4 #s2,
       main.open-4 #s3 {
         display: block;
       }
       /*
        *  gaps
        *
        */
       main.open-1 #s0 {
         padding-right: 0;
       }
       main.open-2 #s0,
       main.open-3 #s0,
       main.open-4 #s0 {
         padding-right: var(--sky-inner-gap, 8px);
       }
       main.open-1 #s1,
       main.open-2 #s1 {
         padding-bottom: 0;
       }
       main.open-3 #s1,
       main.open-4 #s1 {
         padding-bottom: var(--sky-inner-gap, 8px);
       }
       main.open-1 #s2,
       main.open-2 #s2,
       main.open-3 #s2 {
         padding-right: 0;
       }
       main.open-4 #s2 {
         padding-right: var(--sky-inner-gap, 8px);
       }

       /*
        *  mobile
        *
        */
       @media (max-width: 900px) {
         :host {
           grid-template-columns: auto;
           grid-template-rows: 1fr auto;
           grid-template-areas:
           "main"
           "tray";
           padding: 0 !important;
         }
         :host(.open) {
           grid-template-columns: auto;
           grid-template-rows: 1fr auto;
           grid-template-areas:
           "nav"
           "tray";
         }
         :host(.open) main {
           display: none;
         }
         :host(:not(.open)) main {
           display: grid;
           grid-template-columns: auto;
           grid-template-rows: auto;
           grid-template-areas:
           "s0";
         }
         :host(.open) #tray,
         :host(:not(.open)) #tray {
           display: flex;
           flex-direction: row;
           padding: 6px 6px 10px 6px;
         }
         #tray .hideable {
           display: none;
         }
         #nav {
           padding: 8px;
         }
         #nav .hideable {
           display: none;
         }
         main {
           padding: 0;
         }
         main #s0 {
           display: block;
           padding: 0;
           padding-right: 0 !important;
         }
         main.open-login #s0 {
           display: none !important;
         }
         main #s1 {
           display: none !important;
         }
         main #s2 {
           display: none !important;
         }
         main #s3 {
           display: none !important;
         }
       }
      </style>
      <div id="tray" class="fc g2 js af">
        <button
          id="sky-open"
          class="br1 p1 b2 hover fc js ac grow"
          onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('sky-open', {bubbles:true, composed: true}))"
          >
          <span class="p1 s-1 bold">~</span>
        </button>
      </div>
      <nav id="nav" class="fc" style="padding-bottom: 15px;">
        <div id="tab-controller" class="fc g3 grow">
          <button
            id="sky-open"
            class="br1 p1 b2 hover fc jc ac hideable"
            onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('sky-open', {bubbles:true, composed: true}))"
            >
            <span class="p1 s-1 bold">~</span>
          </button>
          <div class="fc g3 grow scroll-y">
            <div class="fr g1 jb">
              <button
                onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('new-window'))"
                class="wfc p2 br1 bd1 b2 hover fr g3 ac"
                >
                <span class="material-symbols-outlined">add</span>
                <span class="f3">new window</span>
              </button>
              <span class="wfc p2 tc grow f2" id="welcome"></span>
            </div>
            <div id="tabs" class="fc g2"></div>
            <div class="grow"></div>
          </div>
          <footer class="fc g2">
            <div class="fr g2">
              <button
              onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('log-out'))"
              class="b2 hover br1 bd0 p2 grow fr g2 ac"
              >
                <span class="f3 wf tc">logout</span>
              </button>
            </div>
          </footer>
        </div>
      </nav>
      <main>
        <slot name="s-none" id="s-none">
          <div class="wf hf b0 br1 fc ac jc f4">no windows open</div>
        </slot>
        <slot name="s-login" id="s-login">
          <div class="wf hf b0 br1 fc ac jc g2">
            <button
            id="login-start"
            class="br1 p3 b2 hover fc jc ac hideable"
            onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('login-start'))">
              <span class="f3 s1">login</span>
            </button>
            <span id="pattern-err" class="hidden f3">Please match requested format.</span>
            <div class="hidden" id="login-name" class="p2">
              <form class="fr g2">
                <input 
                id="ship-input" 
                class="br1 p2 b2"
                type="text"
                placeholder="~zod" 
                pattern="^~((([a-z]{6}){1,2}-{0,2})+|[a-z]{3})$" required
                />
                <button 
                type="button" 
                onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('login-name'))" 
                class="br1 p2 b2 hover">
                  <span id="continue" class="f3">continue</span>
                </button>
              </form>
            </div>
            <div class="hidden p2 fc g2 tc" id="login-code">
              <span id="sign-in" class="f3 p2"></span>
              <form class="fr g2">
                <input 
                id="code-input" 
                class="br1 p2 b2"
                type="password"
                placeholder="sampel-ticlyt-migfun-falmel"
                pattern="^([a-z]{6}-){3}[a-z]{6}$" 
                style="width:220px;"
                required
                />
                <button 
                type="button" 
                onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('login-code'))" 
                class="br1 p2 b2 hover">
                  <span class="f3">login</span>
                </button>
              </form>
            </div>
            <button
            class="br1 p3 b2 hover fr g2 jc ac hideable"
            onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('bridge-redirect'))">
              <span class="f3 s1">purchase a planet</span>
              <img src="icons/02_planet.svg" alt="planet" width="25" height="25">
            </button>
          </div>
        </slot>
        <slot name="s0" id="s0"></slot>
        <slot name="s1" id="s1"></slot>
        <slot name="s2" id="s2"></slot>
        <slot name="s3" id="s3"></slot>
      </main>
      <slot id="default" style="display: none;"></slot>
    `;
      const script = document.createElement("script");
      script.textContent = `
      window.addEventListener('message', (event) => {
        if (event.origin === window.location.origin){
          if(event.data.messagetype === 'new-wind'){
            const customEvent = new CustomEvent('new-window', {detail: {href: event.data.href, slot: 's-2'}});
            const element = document.querySelector('vi-ew');
            if (element) {
              element.dispatchEvent(customEvent);
            }
          }
        }else{
        return;
        }
      })`;
      shadow.appendChild(script);
    }
    async loadCSS(url) {
      const response = await fetch(url);
      const cssText = await response.text();
      const sheet = new CSSStyleSheet();
      await sheet.replace(cssText);
      return sheet;
    }
    get windowsOpen() {
      return parseInt(this.getAttribute("windows-open") || "0");
    }
    get our() {
      return this.getAttribute("our");
    }
    get currentFeatherRules() {
      return this.qs("feather-settings")?.currentFeatherRules || [];
    }
    get windows() {
      let slots = $(this)
        .children("wi-nd[slot]")
        .get()
        .toSorted((a, b) => {
          let aSlot = parseFloat(a.getAttribute("slot").slice(1));
          let bSlot = parseFloat(b.getAttribute("slot").slice(1));
          if (aSlot > bSlot) return 1;
          if (aSlot < bSlot) return -1;
          return 0;
        });
      let noslots = $(this).children("wi-nd:not([slot])").get();
      return [...slots, ...noslots];
    }
    qs(sel) {
      return this.shadowRoot.querySelector(sel);
    }
    qsa(sel) {
      return this.shadowRoot.querySelectorAll(sel);
    }
    gid(id) {
      return this.shadowRoot.getElementById(id);
    }
    connectedCallback() {
      $(this).off();
      $(this).on("sky-open", (e) => {
        console.log("SKY OPEN");
        this.toggleAttribute("open");
        this.saveLayout();
      });
      $(this).on("fix-slots", () => {
        this.fixSlots();
      });
      $(this).on("new-window", (e) => {
        let wind = document.createElement("wi-nd");
        let here = `http://localhost:8000`;
        let slot = e.detail && e.detail.slot ? e.detail.slot : `s-1`;
        $(wind).attr("here", here);
        $(wind).attr("slot", slot);
        this.appendChild(wind);
        this.growFlock();
        this.fixSlots();
      });
      $(this).on("close-window", (e) => {
        let wind = $(e.target);
        if (wind.attr("slot") != undefined) {
          this.shrinkFlock();
        }
        wind.remove();
        this.fixSlots();
        if (!!localStorage.getItem("show-bridge")) {
          localStorage.removeItem("show-bridge");
          localStorage.removeItem("sky-layout");
          this.restoreLayout();
        } else {
          this.renderTabs();
        }
      });
      $(this).on("minimize-window", (e) => {
        let wind = $(e.target);
        if (wind.attr("slot") != undefined) {
          wind.removeAttr("slot");
          this.shrinkFlock();
        }
        this.fixSlots();
        this.renderTabs();
      });
      $(this).on("maximize-window", (e) => {
        let wind = $(e.target);
        if (!wind.attr("slot")) {
          this.growFlock();
        }
        wind.attr("slot", "s-1");
        this.fixSlots();
        this.renderTabs();
      });
      $(this).on("drag-start", (e) => {
        $(this.windows).attr("dragging", "");
      });
      $(this).on("drag-end", (e) => {
        $(this.windows).removeAttr("dragging");
      });
      $(this).on("here-moved", () => {
        this.renderTabs();
      });
      $(this.gid("s0")).off();
      $(this.gid("s0")).on("slotchange", (e) => {
        let authenticated = localStorage.getItem("auth");
        if (authenticated) {
          this.renderTabs();
        }
      });
      $(this.gid("s1")).off();
      $(this.gid("s1")).on("slotchange", () => {
        let authenticated = localStorage.getItem("auth");
        if (authenticated) {
          this.renderTabs();
        }
      });
      $(this.gid("s2")).off();
      $(this.gid("s2")).on("slotchange", () => {
        this.renderTabs();
      });
      $(this.gid("s3")).off();
      $(this.gid("s3")).on("slotchange", () => {
        this.renderTabs();
      });
      $(this.gid("default")).off();
      $(this.gid("default")).on("slotchange", () => {
        this.renderTabs();
      });

      $(this.gid("nav")).off();
      $(this.gid("nav")).on("dragover", (e) => {
        e.preventDefault();
      });
      $(this.gid("nav")).on("drop", (e) => {
        e.preventDefault();
        let wid = e.originalEvent.dataTransfer.getData("text/plain");
        let wind = $(`[wid='${wid}']`);
      });
      //
      $(this).on("login-start", () => {
        $(this.gid("login-name")).removeClass("hidden");
        $(this.gid("login-start")).addClass("hidden");
      });
      $(this).on("login-name", (e) => {
        //  sending post request here to login
        e.preventDefault();
        let input = $(this.gid("ship-input"))[0];
        if (!input.checkValidity()) {
          $(this.gid("pattern-err")).removeClass("hidden");
        } else {
          $(this.gid("pattern-err")).addClass("hidden");
          $(this.gid("login-name")).addClass("hidden");
          $(this.gid("login-code")).removeClass("hidden");
          this.getUrl();
        }
      });
      $(this).on("login-code", (e) => {
        e.preventDefault();
        let input = $(this.gid("code-input"))[0];
        //if (!input.checkValidity()) {
        //  $(this.gid('pattern-err')).removeClass('hidden')
        //} else {
        //  $(this.gid('pattern-err')).addClass('hidden')
        this.postCode();
        //}
      });
      $(this).on("log-out", () => {
        localStorage.removeItem("auth");
        this.toggleAttribute("open");
        this.restoreLayout();
      });
      $(this).on("bridge-redirect", () => {
        localStorage.setItem("show-bridge", true);
        let layout = {
          open: false,
          windowsOpen: 1,
          windows: [
            {
              here: `https://bridge.urbit.org/`,
              slot: "s0",
            },
          ],
        };
        localStorage.setItem("sky-layout", JSON.stringify(layout));
        this.restoreLayout();
      });
      this.qs("main").className = !this.windowsOpen
        ? "open-0"
        : `open-${this.windowsOpen}`;
      this.restoreLayout();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      //
      if (name === "open") {
        $(this.gid("tab-controller")).addClass("hidden");
        if (newValue === null) {
          $(this).removeClass("open");
        } else {
          $(this).addClass("open");
          $(this.gid("tab-controller")).removeClass("hidden");
        }
      } else if (name === "windows-open") {
        console.log(this.windowsOpen);
        this.qs("main").className = !this.windowsOpen
          ? "open-0"
          : `open-${this.windowsOpen}`;
      }
    }
    getUrl() {
      let our = $(this.gid("ship-input"))[0].value;
      localStorage.setItem("our", our);
      const url = `https://bitdeg.arvo.network/apps/ship-url-getter/${our}`;

      $(this.gid("sign-in"))[0].innerHTML = `signing in as ${our}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            // err handling
            throw new Error("Network response " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          let url = data.replace(/\/~\/eauth$/, "");
          localStorage.setItem("local-url", url);
        })
        .catch((error) => {
          // err handling
          console.error("Error:", error);
        });
    }
    async postCode() {
      let our = localStorage.getItem("our");
      let shipUrl = localStorage.getItem("local-url");
      let ticket = $(this.gid("code-input"))[0].value;

      try {
        // const kg = urbitKeyGeneration;

        const ship = ob.patp2dec(our);

        const wallet = await kg.generateWallet({
          boot: false, // do not boot
          ship: ship,
          ticket: ticket,
        });

        const networkSeed = kg.deriveNetworkSeed(
          wallet.management.seed,
          null,
          // TODO do not hardcode revision number
          2
        );
        //console.log(networkSeed)
        const networkKeys = kg.deriveNetworkKeys(networkSeed);
        //console.log(networkKeys)
        const lusCode = kg.generateCode(networkKeys);
        //console.log('+code: ' + kg.generateCode(networkKeys));

        //console.log(`${shipUrl}/~/login`)
        const url = `${shipUrl}/~/login`;
        const body = `password=${lusCode}`;

        // TODO Not compatible with https:// URLs
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
          credentials: "include",
        })
          .then((response) => response.text())
          .then((data) => {
            console.log("Success:", data);
            localStorage.setItem("auth", true);
            this.restoreLayout();
            this.initialLayout(`${shipUrl}`);
            $(this.gid("code-input"))[0].value = "";
            $(this.gid("login-start")).removeClass("hidden");
            $(this.gid("login-code")).addClass("hidden");
          })
          .catch((error) => console.error("Error:", error));
      } catch (err) {
        console.log("Error during log-in process: " + err);
      }
    }
    renderIcon(name) {
      let s = document.createElement("span");
      s.className = "mso";
      s.textContent = name;
      return s;
    }
    renderTabs() {
      let tabs = $(this.gid("tabs"));
      tabs.children().remove();
      let windowsOpen = this.windowsOpen;
      let that = this;
      $(this.windows).each(function (i) {
        let wind = this;
        let tab = document.createElement("div");
        $(tab).addClass("b2 br1 fr af js bd1");
        if (i < windowsOpen) {
          $(tab).addClass("toggled");
        }
        let mux = document.createElement("button");
        mux.className = "b2 hover br1 bd0 p2 grow tl fr g2 ac js";
        mux.style =
          "overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: left;";
        let im = wind.getAttribute("favicon")
          ? `
        <img src="${wind.getAttribute(
          "favicon"
        )}" style="width: 20px; height: 20px;" />
        `
          : ``;
        mux.innerHTML = `
        ${im}
        <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: left;">
          ${$(wind).attr("tab-title") || $(wind).attr("here")}
        </span>
      `;
        let max = $(mux);
        $(max).on("click", () => {
          $(wind).trigger("maximize-window");
        });

        let min = document.createElement("button");
        $(min).append(that.renderIcon("minimize"));
        $(min).addClass("b2 hover br1 bd0 p1 f3");
        $(min).on("click", () => {
          $(wind).trigger("minimize-window");
        });
        if (i >= windowsOpen) {
          $(min).hide();
        }

        let close = document.createElement("button");
        $(close).append(that.renderIcon("close"));
        $(close).addClass("b2 hover br1 bd0 p1 f3");
        $(close).on("click", () => {
          $(wind).trigger("close-window");
        });

        $(tab).append(max);
        $(tab).append(min);
        $(tab).append(close);
        tabs.append(tab);
      });
      this.saveLayout();
    }
    fixSlots() {
      let slotted = $(this.windows).filter("[slot]").get().slice(0, 3);
      $(this.windows).removeAttr("slot");
      slotted.forEach((s, i) => {
        s.setAttribute("slot", `s${i}`);
      });
    }
    growFlock() {
      let currentWindowsOpen = this.windowsOpen;
      if (isNaN(currentWindowsOpen)) {
        currentWindowsOpen = 0;
      }
      $(this).attr("windows-open", Math.min(3, currentWindowsOpen + 1));
      console.log(currentWindowsOpen);
    }
    shrinkFlock() {
      $(this).attr("windows-open", Math.max(0, this.windowsOpen - 1));
    }
    saveLayout() {
      let layout = {
        open: this.hasAttribute("open"),
        windowsOpen: parseInt(this.getAttribute("windows-open")),
        windows: $(this)
          .children("wi-nd")
          .get()
          .map((w) => {
            return {
              here: w.getAttribute("here"),
              slot: w.getAttribute("slot"),
            };
          }),
      };
      localStorage.setItem("sky-layout", JSON.stringify(layout));
    }
    restoreLayout() {
      let layoutString = localStorage.getItem("sky-layout");
      let authenticated = localStorage.getItem("auth");
      let showBridge = localStorage.getItem("show-bridge");
      console.log(layoutString);
      if (!authenticated) {
        if (showBridge) {
          this.settingLayout(layoutString);
        } else {
          //  opening login setup
          this.qs("main").className = `open-login`;
          //
          //  easy solution for now
          //
          if (layoutString) {
            $(this).children("wi-nd").remove();
            localStorage.removeItem("sky-layout");
          }
        }
        // disabling side-menu
        $(this.gid("sky-open")).removeClass("hover");
        $(this.gid("sky-open")).prop("disabled", true);
        //
        //  better solution below
        //
        // let windows = this.getElementsByTagName('wi-nd')
        // Array.from(windows).forEach((w) => {
        //   let slot = $(w).getAttr('slot')
        //   $(w).removeAttr('slot')
        //   //add onAuth slot to layout obj
        //   //$(w).attr('onAuth', slot)
        // })
        //}
      } else if (!!layoutString && authenticated) {
        console.log("Restoring layout + Authenticated!");
        let our = localStorage.getItem("our");
        $(this.gid("welcome"))[0].innerHTML = `Welcome ${our}`;
        //  enabling sidebar menu
        $(this.gid("sky-open")).addClass("hover");
        $(this.gid("sky-open")).prop("disabled", false);
        //  seting up windows layout
        this.settingLayout(layoutString);
      } else {
        console.log("initialLayout");
      }
    }
    initialLayout(url) {
      console.log("new layout");
      // create initial layout
      let layout = {
        open: false,
        windowsOpen: 2,
        windows: [
          // {
          //   here: `${url}/apps/landscape`,
          //   slot: "s0",
          // },
          {
            here: `https://urbit.org`,
            slot: "s0",
          },
          {
            here: `http://localhost:8000/`,
            slot: "s1",
          },
          {
            here: `https://bridge.urbit.org`,
            slot: "s2",
          },
        ],
      };
      localStorage.setItem("sky-layout", JSON.stringify(layout));
      this.restoreLayout();
    }
    settingLayout(layoutString) {
      let layout = JSON.parse(layoutString);
      $(this).attr("open", layout.open ? "" : null);
      $(this).attr("windows-open", `${layout.windowsOpen}`);
      $(this).children("wi-nd").remove();
      layout.windows.forEach((w) => {
        let wind = document.createElement("wi-nd");
        $(wind).attr("here", w.here);
        $(wind).attr("slot", !!w.slot ? w.slot : null);
        $(wind).attr("here", w.here);
        $(this).append(wind);
      });
    }
  }
);
