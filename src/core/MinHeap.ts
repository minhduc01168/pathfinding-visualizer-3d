/**
 * High-performance Binary Min-Heap Priority Queue for Dijkstra & A*
 */

export interface HeapItem<T> {
  score: number;
  data: T;
}

export class MinHeap<T> {
  private heap: HeapItem<T>[] = [];

  get size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  push(data: T, score: number): void {
    this.heap.push({ data, score });
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const bottom = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.sinkDown(0);
    }
    return top.data;
  }

  peek(): T | undefined {
    return this.heap[0]?.data;
  }

  clear(): void {
    this.heap = [];
  }

  private bubbleUp(index: number): void {
    const item = this.heap[index];
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIdx];
      if (item.score >= parent.score) break;
      this.heap[index] = parent;
      index = parentIdx;
    }
    this.heap[index] = item;
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;
    const item = this.heap[index];

    while (true) {
      const leftChildIdx = 2 * index + 1;
      const rightChildIdx = 2 * index + 2;
      let swapIdx: number | null = null;
      let minScore = item.score;

      if (leftChildIdx < length) {
        if (this.heap[leftChildIdx].score < minScore) {
          swapIdx = leftChildIdx;
          minScore = this.heap[leftChildIdx].score;
        }
      }

      if (rightChildIdx < length) {
        if (this.heap[rightChildIdx].score < minScore) {
          swapIdx = rightChildIdx;
        }
      }

      if (swapIdx === null) break;
      this.heap[index] = this.heap[swapIdx];
      index = swapIdx;
    }

    this.heap[index] = item;
  }
}
