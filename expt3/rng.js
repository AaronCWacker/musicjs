class Rng {
  constructor(config = {}) {
    const default_config = {
      seed_offset: 0
    }
    this.config = {...default_config,...config}
    this.seed = 0
    this.rng = new Srand()
    this.new_seed_callbacks = []
  }
  add_new_seed_callback(cb) {
    this.new_seed_callbacks.push(cb)
  }
  new_seed(n) {
    // console.log(`rng new seed ${n}`)
    this.seed = n
    this.reset()
    this.new_seed_callbacks.forEach(cb => cb(this))
  }
  reset() {
    // console.log("rng reset")
    const srand_seed = this.seed + this.config.seed_offset
    this.rng.seed(srand_seed)
    this.rng.random()
    // console.log({srand_seed})
    // for(let i=0; i<10; i++) {
    //   console.log(`rng reset ${this.rand_range(10)}`)
    // }
  }
  rand_range(n) {
    const x = this.rng.intInRange(0,n-1)
    // console.log(`rand_range(${n})`)
    return x
  }
  rand_choice(xs) {
    const y = this.rand_range(xs.length)
    const x = xs[y] 
    // console.log(`rand_choice(${y}) out of ${xs.length}`)
    return x
  }
}