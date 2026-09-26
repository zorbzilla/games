import math, sys
def qpath(T=118, R=308, cx=308, cy=308, tail_mid=2.5, gap_c=60, y_top=365, x_end=638, y_end=619):
    r = R - T
    half = T * math.sqrt(2) / 2
    cu = tail_mid - half          # upper-right edge of the tail: y = x + cu
    cl = tail_mid + half          # lower-left edge of the tail:  y = x + cl
    ce = cl + gap_c               # where the ring stops, below the tail
    def hit(rad, c, sign=1):
        # circle centred (cx, cy) with y = x + c; returns the lower-right intersection
        k = c + cx - cy           # shift into centre coordinates: v = u + k
        u = (-k + sign * math.sqrt(2 * rad * rad - k * k)) / 2
        return cx + u, cy + u + k
    p_start = hit(R, ce)
    p_outer_tail = hit(R, cu)
    p_inner_tail = hit(r, cu)
    p_inner_end = hit(r, ce)
    f = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')
    d = (f'M{f(p_start[0])} {f(p_start[1])}'
         f'A{R} {R} 0 1 1 {f(p_outer_tail[0])} {f(p_outer_tail[1])}'
         f'L{f(x_end)} {f(x_end + cu)}V{y_end}H{f(y_end - cl)}'
         f'L{f(y_top - cl)} {y_top}H{f(y_top - cu)}'
         f'L{f(p_inner_tail[0])} {f(p_inner_tail[1])}'
         f'A{r} {r} 0 1 0 {f(p_inner_end[0])} {f(p_inner_end[1])}Z')
    return d
if __name__ == '__main__':
    T = float(sys.argv[1]) if len(sys.argv) > 1 else 118
    print(qpath(T))
