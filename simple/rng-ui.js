// seed control ui generated programmatically
// RngControls manages the seed, manages triggering
// updates. So when a new seed is set, RngControls
// updates its own copy of the seed, calls new_seed
// on the Rng, and then calls a callback given
// to it by the music renderer.
class RngControls {
  constructor(rng,div_id) {
    // this needs refactoring
    this.target = document.getElementById(div_id)
    this.use_sharps = false
    this.rng = rng
    rng.add_new_seed_callback(this.update_seed)
    this.callbacks = []
    if(!this.target) {
      throw new Error(`Element with id ${div_id} does not exist`)
    }
    this.create_ui()
    this.map_keys()
    this.update_seed()
    this.seed_input.focus()
  }
  map_keys() {        
    this.key_dict = {
      "s": () => { this.toggle_use_sharps() },
      "a": () => { console.log("hello") },
      "i": () => { this.seed_input.focus() }
    }
    window.addEventListener("keypress",this.key_handler)
  }
  key_handler = (e) => {
    const key = e.key
    if( key in this.key_dict ) {
      this.key_dict[key](e)
    }
  }
  add_callback(cb) {
    console.log("add callback")
    this.callbacks.push(cb)
  }
  signal_callbacks() {
    console.log("signal callbacks",this.callbacks)
    this.callbacks.forEach(cb => cb(this))
  }
  create_ui() {
    console.log("create ui")
    const target = this.target
    const crdiv = (id,content,classes=[],cb) => {
      let div
      div = document.createElement("div")
      div.setAttribute("id",id)
      div.classList.add('seed_button')
      classes.forEach(cls => div.classList.add(cls))
      div.addEventListener("click",(e) => { e.preventDefault(); cb(e); })
      div.textContent = content
      target.append(div)
    }

    crdiv("ui_s_m100","-100",["seed_minus"], (e) => this.add(-100))
    crdiv("ui_s_m10","-10",["seed_minus"], (e) => this.add(-10))
    crdiv("ui_s_m1","-1",["seed_minus"], (e) => this.add(-1))

    crdiv("ui_s_p1","+1",["seed_plus"], (e) => this.add(+1))
    crdiv("ui_s_p10","+10",["seed_plus"], (e) => this.add(+10))
    crdiv("ui_s_p100","+100",["seed_plus"], (e) => this.add(+100))

    crdiv("ui_s_daily","Daily",["seed_daily"], (e) => this.daily())

    crdiv("ui_s_random","Random",["seed_random"], (e) => this.random())
    crdiv("ui_s_zero","Zero",["seed_zero"], (e) => this.zero())

    let div
    target.append(document.createElement("br"))

    div = document.createElement("div")
      let input = document.createElement("input")
        input.setAttribute("type","number")
        input.setAttribute("id","ui_seed")
        input.setAttribute("value",0)
        input.addEventListener("change",(e) => this.rng.new_seed(e.target.value))
        div.append(input)
        this.seed_input = input
      
      let text
        text = document.createTextNode("(Current seed: ")
        div.append(text)
    
      let span
        span = document.createElement("span")
        span.textContent = this.rng.seed
        this.current_seed_element = span
        div.append(span)
    
        text = document.createTextNode(")")
        div.append(text)
    target.append(div)
  }
  toggle_use_sharps() {
    this.use_sharps = !this.use_sharps
    this.signal_callbacks()
  }
  update_seed = (n) => {
    const seed = this.rng.seed
    this.current_seed_element.textContent = seed
    this.seed_input.value = seed
    this.signal_callbacks()
  }
  add(n) {
    this.rng.new_seed(this.rng.seed+n)
  }
  daily() {
    const now = Date.now()
    const epoch = Date.parse('1 Jan 2020')
    const days = Math.floor((now - epoch)/(1000*24*3600))
    this.rng.new_seed(days*100); 
  }
  random() {
    const seed_random_range = 10**7
    this.rng.new_seed(Math.floor(Math.random()*seed_random_range))
  }
  zero() {
    this.rng.new_seed(0)
  }
  get_seed() {
    return this.rng.seed
  }
}
