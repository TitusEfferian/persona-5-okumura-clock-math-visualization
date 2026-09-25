export const degreeToRadian = Math.PI / 180

export function skewTangent(skewDegrees: number, slope: number) {
  const tangent = Math.tan(skewDegrees * degreeToRadian)
  return Math.abs(slope * tangent) < 1 ? tangent : 0
}

export function computeCorner(centerX: number, edgeY: number, signedHalfWidth: number, slope: number, tangent: number): [number, number] {
  const horizontalOffset = signedHalfWidth / (1 - slope * tangent)
  return [centerX + horizontalOffset, edgeY + horizontalOffset * tangent]
}

export function getCorners(centerX: number, bottomY: number, height: number, bottomWidth: number, topWidth: number, bottomSkewDegrees: number, topSkewDegrees: number) {
  const bottomHalfWidth = bottomWidth * 0.5, topHalfWidth = topWidth * 0.5, slope = height > 0 ? (topHalfWidth - bottomHalfWidth) / height : 0
  const bottomTangent = skewTangent(bottomSkewDegrees, slope), topTangent = skewTangent(topSkewDegrees, slope), topY = bottomY + height
  return {
    slope, bottomTangent, topTangent, bottomHalfWidth, topHalfWidth, bottomY, topY,
    bottomLeft: computeCorner(centerX, bottomY, -bottomHalfWidth, -slope, bottomTangent), topLeft: computeCorner(centerX, topY, -topHalfWidth, -slope, topTangent),
    topRight: computeCorner(centerX, topY, topHalfWidth, slope, topTangent), bottomRight: computeCorner(centerX, bottomY, bottomHalfWidth, slope, bottomTangent),
  }
}

export type QuadCorners = ReturnType<typeof getCorners>
