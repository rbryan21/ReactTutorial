import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square component
// square does not keep its state, the board manages the state for all of the squares
// it receives its value from its parent Board component and informs its parent when it's clicked. 
// This type of component is known as a Controlled Component

// We can rewrite the Square component:
    // class Square extends React.Component {
    //     render() {
    //       return (
    //         <button className="square" onClick={() => this.props.onClick({value: 'X'})}>
    //           {this.props.value}
    //         </button>
    //       );
    //     }
    //   }
// Like so, because React supports a simpler syntax called functional components for component types
// like Square that only consist of a render method. Rathern than define a class extending React.Component,
// simply write a function that takes props and returns what should be referenced.

    function Square(props) {
        // notice that onClick does not contain parenthesis, this would cause the onClick to
        // execute immediately. Omitting the parenthesis just "passes the function down"
        return (
            <button className="square" onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
  
  // Board component - renders 9 squares
  class Board extends React.Component {

    renderSquare(i) {
      // passing in a value prop to the Square component
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
  }
  
  // Game component - renders board
  class Game extends React.Component {

    // pulling information from Board into Game
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];      
        // we call slice to copy the squares array instead of mutating the existing array
        const squares = current.squares.slice();
        // ignore the click if someone is a winner or the square has already been filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        // component and its children are rerendered automatically when setState is called
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }    

    jumpTo(step) {
        this.setState({
            stepNumber : step,
            xIsNext: (step % 2) === 0,
        });
    }

    // Game's render looks at the most recent history entry and can take over 
    // calculating the game status
    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // showing the previous moves made in the game so far
        // move == index
        const moves = history.map((step, move) => {
            const desc = move ?
                'Move #' + move :
                'Game start';
            // the key property on li is used by React to determine what's changed
            // when a list is updated. A key must be differentiate each component from its
            // siblings. A database ID is usually a good choice.
            // It's strongly recommended that you assign proper keys whenever you build dynamic lists
            // Component keys don't need to be globally unique, only unique relative to the immediate siblings.
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            )
        });

        let status;
        if (winner) {
        status = 'Winner: ' + winner;
        } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }        

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  