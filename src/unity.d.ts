export {}

declare global {
  interface UnityInstance {
    Quit(): Promise<void>
    SetFullscreen(fullscreen: 0 | 1): void
    SendMessage(objectName: string, methodName: string, value?: string | number): void
  }

  interface UnityConfig {
    arguments?: string[]
    dataUrl: string
    frameworkUrl: string
    codeUrl: string
    streamingAssetsUrl?: string
    companyName?: string
    productName?: string
    productVersion?: string
    matchWebGLToCanvasSize?: boolean
    devicePixelRatio?: number
    showBanner?: (msg: string, type?: string) => void
  }

  function createUnityInstance(
    canvas: HTMLCanvasElement,
    config: UnityConfig,
    onProgress?: (progress: number) => void,
  ): Promise<UnityInstance>
}
