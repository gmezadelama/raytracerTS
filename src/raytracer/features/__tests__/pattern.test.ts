import { StripePattern, WhitePattern, BlackPattern, Pattern, GradientPattern, RingPattern, CheckersPattern } from "../pattern";
import Sphere from "../../geometry/sphere";
import { equalPixelColor, createPoint, PixelColor, createPixelColor } from "../../math/tuple";
import Shape from "../../geometry/shape";
import Transformations from "../transformations";

describe('testing stripe pattern', () => {
  let pattern: StripePattern;
  beforeAll(() => {
    pattern = new StripePattern(WhitePattern, BlackPattern);
  });
  test('A stripe pattern is constant in y', () => {
    let p000 = createPoint(0, 0, 0);
    let p010 = createPoint(0, 1, 0);
    let p020 = createPoint(0, 2, 0);
    expect(equalPixelColor(WhitePattern, pattern.setPatternAtPoint(p000))).toBeTruthy();
    expect(equalPixelColor(WhitePattern, pattern.setPatternAtPoint(p010))).toBeTruthy();
    expect(equalPixelColor(WhitePattern, pattern.setPatternAtPoint(p020))).toBeTruthy();
  });
  test('A stripe pattern is constant in z', () => {
    let p000 = createPoint(0, 0, 0);
    let p001 = createPoint(0, 0, 1);
    let p002 = createPoint(0, 0, 2);
    expect(equalPixelColor(WhitePattern, pattern.setPatternAtPoint(p000))).toBeTruthy();
    expect(equalPixelColor(WhitePattern, pattern.setPatternAtPoint(p001))).toBeTruthy();
    expect(equalPixelColor(WhitePattern, pattern.setPatternAtPoint(p002))).toBeTruthy();
  });
  test('A stripe pattern alternates in x', () => {
    let whitePoint1 = createPoint(0, 0, 0);
    let whitePoint2 = createPoint(0.9, 0, 0);
    let blackPoint1 = createPoint(1, 0, 0);
    let blackPoint2 = createPoint(-0.1, 0, 0);
    let blackPoint3 = createPoint(-1, 0, 0);
    let whitePoint3 = createPoint(-1.1, 0, 0);
    expect(equalPixelColor(WhitePattern, pattern.setPatternAtPoint(whitePoint1))).toBeTruthy();
    expect(equalPixelColor(WhitePattern, pattern.setPatternAtPoint(whitePoint2))).toBeTruthy();
    expect(equalPixelColor(BlackPattern, pattern.setPatternAtPoint(blackPoint1))).toBeTruthy();
    expect(equalPixelColor(BlackPattern, pattern.setPatternAtPoint(blackPoint2))).toBeTruthy();
    expect(equalPixelColor(BlackPattern, pattern.setPatternAtPoint(blackPoint3))).toBeTruthy();
    expect(equalPixelColor(WhitePattern, pattern.setPatternAtPoint(whitePoint3))).toBeTruthy();
  });
  test('stripes with an object transformation', () => {
    let o: Shape = new Sphere();
    o.transform = Transformations.scaling(2, 2, 2);
    let pattern: Pattern = new StripePattern(WhitePattern, BlackPattern);
    let color: PixelColor = pattern.setPatternAtShape(o, createPoint(1.5, 0, 0));
    expect(equalPixelColor(WhitePattern, color)).toBeTruthy();
  });
  test('stripes with a pattern transformation', () => {
    let o: Shape = new Sphere();
    let pattern: Pattern = new StripePattern(WhitePattern, BlackPattern);
    pattern.transform = Transformations.scaling(2, 2, 2);
    let color: PixelColor = pattern.setPatternAtShape(o, createPoint(1.5, 0, 0));
    expect(equalPixelColor(WhitePattern, color)).toBeTruthy();
  });
  test('stripes with both an object and a pattern transformation', () => {
    let o: Shape = new Sphere();
    o.transform = Transformations.scaling(2, 2, 2);
    let pattern: Pattern = new StripePattern(WhitePattern, BlackPattern);
    pattern.transform = Transformations.translation(0.5, 0, 0);
    let color: PixelColor = pattern.setPatternAtShape(o, createPoint(2.5, 0, 0));
    expect(equalPixelColor(WhitePattern, color)).toBeTruthy();
  });
});

describe('testing gradient pattern', () => {
  test('a gradient linearly interpolates between colors', () => {
    let pattern: Pattern = new GradientPattern(WhitePattern, BlackPattern);
    expect(equalPixelColor(
      WhitePattern,
      pattern.setPatternAtPoint(createPoint(0, 0, 0))
    )).toBeTruthy();
    expect(equalPixelColor(
      createPixelColor(0.75, 0.75, 0.75),
      pattern.setPatternAtPoint(createPoint(0.25, 0, 0))
    )).toBeTruthy();
    expect(equalPixelColor(
      createPixelColor(0.5, 0.5, 0.5),
      pattern.setPatternAtPoint(createPoint(0.5, 0, 0))
    )).toBeTruthy();
    expect(equalPixelColor(
      createPixelColor(0.25, 0.25, 0.25),
      pattern.setPatternAtPoint(createPoint(0.75, 0, 0))
    )).toBeTruthy();
  });
});

describe('testing ring pattern', () => {
  test('a ring should extend in both x and z', () => {
    let pattern: Pattern = new RingPattern(WhitePattern, BlackPattern);
    expect(equalPixelColor(
      WhitePattern,
      pattern.setPatternAtPoint(createPoint(0, 0, 0))
    )).toBeTruthy();
    expect(equalPixelColor(
      BlackPattern,
      pattern.setPatternAtPoint(createPoint(1, 0, 0))
    )).toBeTruthy();
    expect(equalPixelColor(
      BlackPattern,
      pattern.setPatternAtPoint(createPoint(0, 0, 1))
    )).toBeTruthy();
    expect(equalPixelColor(
      BlackPattern,
      pattern.setPatternAtPoint(createPoint(0.708, 0, 0.708))
    )).toBeTruthy();
  });
});

describe('testing checkers pattern', () => {
  let pattern: Pattern;
  beforeAll(() => {
    pattern = new CheckersPattern(WhitePattern, BlackPattern);
  });
  test('checkers should repeat in x', () => {
    expect(equalPixelColor(
      WhitePattern,
      pattern.setPatternAtPoint(createPoint(0, 0, 0))
    )).toBeTruthy();
    expect(equalPixelColor(
      WhitePattern,
      pattern.setPatternAtPoint(createPoint(0.99, 0, 0))
    )).toBeTruthy();
    expect(equalPixelColor(
      BlackPattern,
      pattern.setPatternAtPoint(createPoint(1.01, 0, 0))
    )).toBeTruthy();
  });
  test('checkers should repeat in y', () => {
    expect(equalPixelColor(
      WhitePattern,
      pattern.setPatternAtPoint(createPoint(0, 0, 0))
    )).toBeTruthy();
    expect(equalPixelColor(
      WhitePattern,
      pattern.setPatternAtPoint(createPoint(0, 0.99, 0))
    )).toBeTruthy();
    expect(equalPixelColor(
      BlackPattern,
      pattern.setPatternAtPoint(createPoint(0, 1.01, 0))
    )).toBeTruthy();
  });
  test('checkers should repeat in z', () => {
    expect(equalPixelColor(
      WhitePattern,
      pattern.setPatternAtPoint(createPoint(0, 0, 0))
    )).toBeTruthy();
    expect(equalPixelColor(
      WhitePattern,
      pattern.setPatternAtPoint(createPoint(0, 0, 0.99))
    )).toBeTruthy();
    expect(equalPixelColor(
      BlackPattern,
      pattern.setPatternAtPoint(createPoint(0, 0, 1.01))
    )).toBeTruthy();
  });
});
