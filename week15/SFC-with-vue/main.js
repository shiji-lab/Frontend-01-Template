import { createElement, Text, Wrapper } from './createElement'
import { Carousel } from './carousel.view'

// class Carousel {
//   constructor(config) {
//     this.children = []
//     this.attributes = new Map()
//     this.properties = new Map()
//   }

//   setAttribute(name, value) {
//     this[name] = value
//   }

//   appendChild(child) {
//     this.children.push(child)
//   }

//   render() {
//     let children = this.data.map(url => {
//       let element = <img src={url} />
//       element.addEventListener('dragstart', event => event.preventDefault())
//       return element
//     })

//     let position = 0

//     let nextPic = () => {
//       let nextPosition = (position + 1) % this.data.length

//       let current = this.root.childNodes[position]
//       let next = this.root.childNodes[nextPosition]

//       current.style.transition = 'ease 0s'
//       next.style.transition = 'ease 0s'

//       current.style.transform = `translateX(${-100 * position}%)`
//       next.style.transform = `translateX(${100 - 100 * nextPosition}%)`

//       setTimeout(function() {
//         current.style.transition = '' //  mean use ass rule
//         next.style.transition = ''

//         current.style.transform = `translateX(${-100 - 100 * position}%)`
//         next.style.transform = `translateX(${-100 * nextPosition}%)`

//         position = nextPosition
//       }, 16)
//       setTimeout(nextPic, 1000)

//       return <div class="carousel">{children}</div>
//     }
//   }

//   mountTo(parent) {
//     this.render().mountTo(parent)
//   }
// }

let component = (
  <Carousel
    data={[
      'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
      'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
      'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
      'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    ]}
  />
)

component.mountTo(document.body)

console.log(component)
