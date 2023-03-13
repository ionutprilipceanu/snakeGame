import {
  Component,
  HostListener,
  Output,
  OnInit,
  EventEmitter,
  OnChanges,
} from '@angular/core';

interface snakeCell {
  x: number;
  y: number;
}

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent implements OnInit {
  myArray: number[][] = [];

  gridRows: number[] = new Array(10);
  gridCols: number[] = new Array(10);

  snake: snakeCell[] = [
    {
      x: 5,
      y: 3,
    },
    {
      x: 5,
      y: 2,
    },
    {
      x: 5,
      y: 1,
    },
  ];

  snakeRow: number = 5;
  snakeCol: number = 5;

  direction: string = 'right';
  up: string = 'up';
  down: string = 'down';
  left: string = 'left';
  right: string = 'right';

  randomColFood: number = Math.floor(Math.random() * this.snakeCol) + 1;
  randomRowFood: number = Math.floor(Math.random() * this.snakeRow) + 1;

  randomColBoomb: number = Math.floor(Math.random() * this.snakeCol) + 1;
  randomRowBoomb: number = Math.floor(Math.random() * this.snakeRow) + 1;

  gameOver = false;
  count: any = 0;
  level: number = 1;
  intervalName: any;

  name: string;
  storedPlayers: any = [];

  constructor() {
    this.storedPlayers = Object.keys(sessionStorage)
      .filter((key) => key.startsWith('player-'))
      .map((key) => {
        const user: any = sessionStorage.getItem(key);
        return JSON.parse(user);
      })
      .sort((a: any, b: any) => b.count - a.count);

    //display grid
    for (let i = 0; i < 10; i++) {
      this.myArray[i] = [];
    }
  }

  ngOnInit(): void {
    this.snake.forEach((cell, index) => {
      this.myArray[cell.x][cell.y] = 2;

      // generate food
      if (this.randomRowFood === cell.x && this.randomColFood === cell.y) {
        this.randomColFood = Math.floor(Math.random() * 10);
        this.randomRowFood = Math.floor(Math.random() * 10);
      }

      // change boomb position at every 7 sec
      clearInterval(this.intervalName);
      this.intervalName = setInterval(() => {
        if (this.gameOver !== true) {
          this.randomColBoomb = Math.floor(Math.random() * 10);
          this.randomRowBoomb = Math.floor(Math.random() * 10);
          // if snake is on the same square with new boom generate again
          if (
            this.randomRowBoomb === cell.x &&
            this.randomColBoomb === cell.y
          ) {
            this.randomColBoomb = Math.floor(Math.random() * 10);
            this.randomRowBoomb = Math.floor(Math.random() * 10);
          }
        }
      }, 7000);
    });

    this.intervalName = setInterval(() => {
      if (this.gameOver !== true) {
        this.moveIcon();
      }
      this.foodAte();
      this.checkDeath();
    }, 2000);
  }

  // save username and score into session storage
  saveName() {
    if (this.name) {
      if (this.gameOver === true) {
        const key = `player-${new Date().getTime()}`;
        sessionStorage.setItem(
          key,
          JSON.stringify({ name: this.name, count: this.count })
        );
        this.name = '';
        this.count = '';
      }
      this.storedPlayers = Object.keys(sessionStorage)
        .filter((key) => key.startsWith('player-'))
        .map((key) => {
          const user: any = sessionStorage.getItem(key);
          return JSON.parse(user);
        })
        .sort((a: any, b: any) => b.count - a.count);
    }
    return;
  }

  // clear rank
  clearSessionStorage() {
    sessionStorage.clear();
    window.location.reload();
  }

  // change snake direction
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.gameOver !== true) {
      switch (event.key) {
        case 'ArrowUp':
          if (this.direction !== 'down') {
            this.direction = 'up';
          }
          break;
        case 'ArrowDown':
          if (this.direction !== 'up') {
            this.direction = 'down';
          }
          break;
        case 'ArrowLeft':
          if (this.direction !== 'right') {
            this.direction = 'left';
          }
          break;
        case 'ArrowRight':
          if (this.direction !== 'left') {
            this.direction = 'right';
          }
          break;
      }
    }
    this.moveIcon();
  }

  moveIcon() {
    this.snake.unshift({
      ...this.snake[0],
    });

    switch (this.direction) {
      case this.up:
        // moveUp
        if (this.snake[0].x > 0) {
          this.snake[0].x--;
          this.foodAte();
          this.checkDeath();
        } else {
          this.snake[0].x = 9;
          this.foodAte();
          this.checkDeath();
        }
        break;
      case this.down:
        // moveDown
        if (this.snake[0].x < this.gridRows.length - 1) {
          this.snake[0].x++;
          this.foodAte();
          this.checkDeath();
        } else {
          this.snake[0].x = 0;
          this.foodAte();
          this.checkDeath();
        }
        break;
      case this.left:
        // moveLeft
        if (this.snake[0].y > 0) {
          this.snake[0].y--;
          this.foodAte();
          this.checkDeath();
        } else {
          this.snake[0].y = 9;
          this.foodAte();
          this.checkDeath();
        }
        break;
      case this.right:
        // moveRight
        if (this.snake[0].y < this.gridCols.length - 1) {
          this.snake[0].y++;
          this.foodAte();
          this.checkDeath();
        } else {
          this.snake[0].y = 0;
          this.foodAte();
          this.checkDeath();
        }
        break;
    }

    this.myArray[this.snake[this.snake.length - 1].x][
      this.snake[this.snake.length - 1].y
    ] = 0;
    this.snake.pop();
    this.snake.forEach((cell, index) => {
      this.myArray[cell.x][cell.y] = 2;
    });
  }

  // if food and boom are on the same square generate them again
  foodAte() {
    if (
      this.randomColFood === this.randomColBoomb &&
      this.randomRowFood === this.randomRowBoomb
    ) {
      this.randomColFood = Math.floor(Math.random() * 10);
      this.randomRowFood = Math.floor(Math.random() * 10);
    }

    // if food is generate on snake generate them again
    this.snake.forEach((cell, index) => {
      if (cell.y === this.randomColFood && cell.x === this.randomRowFood) {
        this.count++;
        this.randomColFood = Math.floor(Math.random() * 10);
        this.randomRowFood = Math.floor(Math.random() * 10);
        this.snake.push(this.snake[this.snake.length - 1]);
      }
    });

    // increase level
    if (this.count === 5) {
      this.level = 2;
      clearInterval(this.intervalName);
      this.intervalName = setInterval(() => {
        if (this.gameOver !== true) {
          this.moveIcon();
        }
        this.foodAte();
        this.checkDeath();
      }, 1500);
    }

    if (this.count === 10) {
      this.level = 3;
      clearInterval(this.intervalName);
      this.intervalName = setInterval(() => {
        if (this.gameOver !== true) {
          this.moveIcon();
        }
        this.foodAte();
        this.checkDeath();
      }, 1000);
    }

    if (this.count === 15) {
      this.level = 4;
      clearInterval(this.intervalName);
      this.intervalName = setInterval(() => {
        if (this.gameOver !== true) {
          this.moveIcon();
        }
        this.foodAte();
        this.checkDeath();
      }, 500);
    }

    if (this.count > 15) {
      this.level = 5;
      clearInterval(this.intervalName);
      this.intervalName = setInterval(() => {
        if (this.gameOver !== true) {
          this.moveIcon();
        }
        this.foodAte();
        this.checkDeath();
      }, 250);
    }

    if (this.count > 20) {
      this.level = 6;
      clearInterval(this.intervalName);
      this.intervalName = setInterval(() => {
        if (this.gameOver !== true) {
          this.moveIcon();
        }
        this.foodAte();
        this.checkDeath();
      }, 100);
    }
  }

  checkDeath() {
    this.snake.forEach((cell) => {
      if (
        (cell !== this.snake[0] &&
          this.snake[0].x === cell.x &&
          this.snake[0].y === cell.y) ||
        (this.randomColBoomb === this.snake[0].y &&
          this.randomRowBoomb === this.snake[0].x)
      ) {
        this.gameOver = true;
      }
    });
  }

  reload() {
    window.location.reload();
  }
}
