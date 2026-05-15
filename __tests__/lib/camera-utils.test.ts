import { captureVideoFrame } from '@/lib/camera-utils'

function createMockVideo(width = 640, height = 480): HTMLVideoElement {
  const video = document.createElement('video')
  Object.defineProperty(video, 'videoWidth', { value: width, configurable: true })
  Object.defineProperty(video, 'videoHeight', { value: height, configurable: true })
  return video
}

describe('captureVideoFrame', () => {
  let drawImage: jest.Mock
  let toDataURL: jest.Mock

  beforeEach(() => {
    drawImage = jest.fn()
    toDataURL = jest.fn().mockReturnValue('data:image/jpeg;base64,mock')

    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      translate: jest.fn(),
      scale: jest.fn(),
      drawImage,
      filter: '',
    } as unknown as CanvasRenderingContext2D)

    jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(toDataURL)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns null when video has no dimensions', () => {
    const video = createMockVideo(0, 0)
    expect(captureVideoFrame(video)).toBeNull()
  })

  it('captures mirrored frame without filter', () => {
    const video = createMockVideo()
    const result = captureVideoFrame(video)
    expect(result).toBe('data:image/jpeg;base64,mock')
    expect(drawImage).toHaveBeenCalled()
    expect(toDataURL).toHaveBeenCalledWith('image/jpeg', 0.9)
  })

  it('applies filter string to canvas context when provided', () => {
    const video = createMockVideo()
    const ctx = HTMLCanvasElement.prototype.getContext('2d') as CanvasRenderingContext2D & {
      filter: string
    }
    captureVideoFrame(video, 'sepia(100%) brightness(110%)')
    expect(ctx.filter).toBe('sepia(100%) brightness(110%)')
  })
})
