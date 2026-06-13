import { linear } from './easing'

export default class Flip {
  selector
  defaults

  constructor(selector, defaults = {}) {
    this.selector = selector
    this.defaults = defaults
  }

  rect(el) {
    const r = el.getBoundingClientRect().toJSON()

    return { el, ...r }
  }

  measure() {
    return Array.from(document.querySelectorAll(this.selector)).map(this.rect)
  }

  absolute(el, to) {
    el.setAttribute(
      'style',
      `position: absolute; width: ${to.width}px; height: ${to.height}px; top: ${to.top}px; left: ${to.left}px`,
    )

    return () => el.removeAttribute('style')
  }

  invert(el, from, to, options) {
    const { resolve, promise } = Promise.withResolvers()

    const dx = from.left - to.left
    const dy = from.top - to.top

    const removeAbsolute = this.absolute(el, to)

    const animation = el.animate(
      [
        {
          width: `${from.width}px`,
          height: `${from.height}px`,
          transform: `translate(${dx}px, ${dy}px)`,
        },
        {
          width: `${to.width}px`,
          height: `${to.height}px`,
          transform: `translate(0px, 0px)`,
        },
      ],
      {
        ...options,
        fill: 'backwards',
      },
    )

    animation.onfinish = () => {
      resolve()
      removeAbsolute()
    }

    return promise
  }

  flip(options = {}) {
    const { promise, resolve } = Promise.withResolvers()

    const promises = []

    const { easing = linear, delay = 0, staggering = 0, duration = 1000 } = options
    const from = this.measure()

    requestAnimationFrame(() => {
      const to = this.measure()

      for (let i = 0; i < from.length; i++) {
        const promise = this.invert(to[i].el, from[i], to[i], {
          delay: i * staggering + delay,
          easing,
          duration,
        })

        promises.push(promise)
      }

      Promise.all(promises).then(resolve)
    })

    return promise
  }
}
