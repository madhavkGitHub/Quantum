
var X = -2000
var Y = -3000
var Z = -4000
var S = 5000
var T = -5000
var H = -9
const worldMap = [
    [0],
    [1],
    [2],
    [3],
    [4],
    [5], 
    [6],
    [7]
  ];

const levels = [
  [
    [1, 1, 1, 0, 1],
    [1, 0, 0, 0,  1],
    [1, 0, 0, 1,  1],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0,  1],
    [1, 0, 0, 0,  1],
    [1, 1, 1, 0,  1],
    [1, 1, 1,   [-1, 0], 1]
  ],
  [
    [1, [-1, 0], 1, 1, 1, 1, 1 ],
    [1, 3, 1, 0, 0, 0, 2],
    [1, 0, 2, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 2],
    [1, 0, 0, 0, 1, 0, 1],
    [1, 1, 2, 2,  1, [-1,0], 1]
  ],
  [
    [1, [-1,0], 1, -9, -9, -9, -9, -9, -9, -9, -9, -9, -9],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -9],
    [1, 3, 1, 0, 0, T, 0, S, 2, 0, X, T, 1],
    [1, 0, 1, X, 0, T, 0, T, 0, 0, 0, 2, 1],
    [1, 0, 1, 0, 0, T, 2, 1, 1, S, S, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, X, S, X, S, 1],
    [1, 0, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1], 
    [1, 0, 0, X, T, 2, 0, X, T, X, T, 1, 1], 
    [1, 1, 1, 2, 2, 2, 1, [-1,0], 1, 1, 1, 1, -9]
  ],
  [
    [ 1, 1, 1, 1, 1, [-1, 0], 1], 
    [ 1, X, 2, 0, 0, 3, 1], 
    [ 1, 0, 1, 0, 0, Y, 1], 
    [ 1, 0, 0, T, 0, 0, 1], 
    [ 1, 0, S, T, , 2, 1], 
    [ 1, 0, 0, T, 0, 2, 1],
    [ 1, 0, S, 0, 0, 2, 1], 
    [ 1, 0, S, 0, X, T, 2], 
    [ 1, 0, 0, 0, 0, 0, 1],
    [ 1, T, T, T, 2, 1, 1],
    [ 1, 0, 0, 0, 2, 1, -9], 
    [ 1, 0, 0, 0, 1, 1, -9], 
    [1,[-1, 0] , 1, 1, 1, -9, -9 ]
  ],
  [
    [1, 1, [-1, 0], 1, 1, 1,  1, 1, 1], 
    [1, 0, 3, 1, 0, 0, 2, 0, 1], 
    [1, 0, 0, 0, S, Z, 0, 0, 1 ], 
    [1, X, 0, 0, 2, 1, 1, Y, 1], 
    [1, 1, 1, 1, 1, 1, 0, 0, 1], 
    [1, 0, 0, 0, S, 0, Y, 0, 2],
    [1, 0, Z, 0, 0, 0, 0, 0, 2 ], 
    [1, 0, 0, S, Z, 0, S, 0 , 2], 
    [1, [-1, 0],  1, 1, 1, 1, 1, 1, 1]
  ],
  [[1, [-1,0], 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
  [1, 3, 1, 0, 0, 0, 0, 0, 1, 2, 0, X, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
  [1, 2, 2, 2, 2, 0, 1, 1, 0, 0, 2, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1],
  [[-1,0], 0, 2, 2, 2, 2, 2, 2, 2, 2, 0,  Y, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, S, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, Y, 0, Y, 0, Y, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1],
  [0, 0, 0, T, 0, T, 0, 0, 0, 0, 1, 2, 1],
  [0, H, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]
  ]

]
