class Sprite {
  constructor({
    isBackgroundLayer = false,
    position,
    imageSrc,
    frameRate = 1,
    animations,
    frameBuffer = 2,
    loop = true,
    autoplay = true,
    scale = 1,
    x2 = 0
  }) {
    this.isBackgroundLayer = isBackgroundLayer;
    this.position = position
    this.image = new Image()
    this.scale = scale
    this.image.onload = () => {
      this.loaded = true
      this.width = this.scale * (this.image.width / this.frameRate);
      this.height = this.image.height * this.scale
      this.x2 = this.position.x + this.image.width * this.scale;
      this.x = this.position.x * this.scale;
    }
    this.image.src = imageSrc
    this.loaded = false
    this.frameRate = frameRate
    this.currentFrame = 0
    this.elapsedFrames = 0
    this.frameBuffer = frameBuffer
    this.animations = animations
    this.loop = loop
    this.autoplay = autoplay
    this.currentAnimation
    this.x2 = x2 + this.image.width


    if (this.animations) {
      for (let key in this.animations) {
        const image = new Image()
        image.src = this.animations[key].imageSrc
        this.animations[key].image = image
      }
    }
  }

  draw() {

    if (!this.loaded) return
    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    }



    if (!this.isBackgroundLayer) {
      c.drawImage(
        this.image,
        cropbox.position.x,
        cropbox.position.y,
        cropbox.width,
        cropbox.height,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      )
    }

    if (this.isBackgroundLayer) {
      c.drawImage(
        this.image,
        cropbox.position.x,
        cropbox.position.y,
        cropbox.width,
        cropbox.height,
        this.x,
        this.position.y,
        this.width,
        this.height
      )

      c.drawImage(
        this.image,
        cropbox.position.x,
        cropbox.position.y,
        cropbox.width,
        cropbox.height,
        this.x2,
        this.position.y,
        this.width,
        this.height
      )

    }

    this.updateFrames()
  }

  play() {
    this.autoplay = true
  }


  
  



setPosition(position) {
  // Update the x2 position first
  this.x2 = this.position.x + this.image.width * this.scale;

  // Check if the first layer has left the screen
  if (this.x + this.image.width * this.scale < 0) {
    // The first layer has left the screen, so reset it to start at the end of the second layer
    this.x = this.x2 + this.image.width;
  } else if (this.x + this.image.width * this.scale > 0) {
    this.x = this.position.x * this.scale;
  }

  // Check if the second layer has left the screen
  if (this.x2 + this.image.width * this.scale < 0) {
    // The second layer has left the screen, so reset it to start at the end of the first layer
    this.x2 = this.x + this.image.width;
  } else if (this.x2 + this.image.width * this.scale > 0) {
    this.x2 = this.position.x + this.image.width * this.scale;
  }

  // Finally, update the position of the sprite
  this.position.y = position.y;
}

  updateFrames() {

    if (!this.autoplay) return

    this.elapsedFrames++

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++
      else if (this.loop) this.currentFrame = 0
    }

    if (this.currentAnimation?.onComplete) {
      if (
        this.currentFrame === this.frameRate - 1 &&
        !this.currentAnimation.isActive
      ) {
        this.currentAnimation.onComplete()
        this.currentAnimation.isActive = true
      }
    }
  }
}