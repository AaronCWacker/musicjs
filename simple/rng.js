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
    this.seed = n
    this.reset()
    this.new_seed_callbacks.forEach(cb => cb(this))
  }
  reset() {
    this.rng.seed(this.seed + this.config.seed_offset)
    this.rng.random()
  }
  rand_range(n) {
    return this.rng.intInRange(0,n-1)
  }
  rand_choice(xs) {
    return xs[this.rand_range(xs.length)]
  }
}