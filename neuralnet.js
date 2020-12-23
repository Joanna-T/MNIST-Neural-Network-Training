class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.matrix = [];

    for (let i = 0; i < this.rows; i++) {
      this.matrix.push([]);
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i].push(0);
      }
    }
  }

  randomize(min, max) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = Math.random() * (max - min) + min;
      }
    }
  }

  multiply(x) {
    if (x instanceof Matrix) {
      if (this.cols !== x.rows) {
        console.log("columns of a must match rows of b");
        return undefined;
      }

      let result = new Matrix(this.rows, x.cols);
      for (let i = 0; i < result.rows; i++) {
        for (let j = 0; j < result.cols; j++) {
          let total = 0;
          for (let k = 0; k < this.matrix[i].length; k++) {
            total += this.matrix[i][k] * x.matrix[k][j];
          }

          result.matrix[i][j] = total;
        }
      }
      return result;
    } else if (typeof x === "number") {
      let result = new Matrix(this.rows, this.cols);
      let multiple;
      for (let i = 0; i < this.rows; i++) {
        //multiply by scalar value
        for (let j = 0; j < this.cols; j++) {
          multiple = this.matrix[i][j] * x;
          result.matrix[i][j] = multiple;
        }
      }
      return result;
    }
  }

  hadamard_product(x) {
    if (x instanceof Matrix) {
      if (this.rows != x.rows || this.cols != x.cols) {
        console.log("dimensions of matrix a and b must match");
        return;
      } else {
        let result = new Matrix(this.rows, this.cols);
        let multiple;
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            multiple = this.matrix[i][j] * x.matrix[i][j];
            result.matrix[i][j] = multiple;
          }
        }
        return result;
      }
    } else {
      console.log("input must be a matrix");
    }
  }

  add(x) {
    if (x instanceof Matrix) {
      if (this.cols !== x.cols || this.rows !== x.rows) {
        console.log("columns and rows of a must match columns and rows of b");
        return undefined;
      }
      let result = new Matrix(this.rows, this.cols);
      let added;
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          added = this.matrix[i][j] + x.matrix[i][j];
          result.matrix[i][j] = added;
        }
      }
      return result;
    } else if (typeof x === "number") {
      let result = new Matrix(this.rows, this.cols);
      let added;
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          added = this.matrix[i][j] + x;
          result.matrix[i].push(added);
        }
      }
      return result;
    }
  }

  subtract(x) {
    if (x instanceof Matrix) {
      if (this.cols !== x.cols || this.rows !== x.rows) {
        console.log("columns and rows of a must match columns and rows of b");
        return undefined;
      }
      let result = new Matrix(this.rows, this.cols);
      let sub_val;
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          sub_val = this.matrix[i][j] - x.matrix[i][j];
          result.matrix[i][j] = sub_val;
        }
      }
      return result; // returns matrix
    } else if (typeof x === "number") {
      let result = new Matrix(this.rows, this.cols);
      let sub_val;
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          sub_val = this.matrix[i][j] + x;
          result.matrix[i].push(sub_val);
        }
      }
      return result;
    }
  }

  arrayToMatrix(x) {
    for (let i = 0; i < this.rows; i++) {
      //first make matrix with correct dimensions, then transform values to desired with array
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = x[i][j];
      }
    }
  }

  mapit(func) {
    let result = new Matrix(this.rows, this.cols);
    let val;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        val = func(this.matrix[i][j]);
        result.matrix[i][j] = val;
      }
    }
    return result;
  }

  transpose() {
    let result = new Matrix(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.matrix[j][i] = this.matrix[i][j];
      }
    }
    return result;
  }
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function diff_sigmoid(x) {
  return x * (1 - x);
}

function relu(x) {
  return Math.max(x, 0.5);
}

class NeuralNetwork {
  constructor(input, hidden, output) {
    this.input = input;
    this.hidden = hidden;
    this.output = output;

    this.weights_ih = new Matrix(this.hidden, this.input);
    this.weights_ho = new Matrix(this.output, this.hidden);
    this.weights_ih.randomize(-1, 1);
    this.weights_ho.randomize(-1, 1);
    this.bias_h = new Matrix(this.hidden, 1);
    this.bias_o = new Matrix(this.output, 1);
    this.bias_h.randomize(-0.5, 0.5);
    this.bias_o.randomize(-0.5, 0.5);
  }

  feedforward(input) {
    //expects matrix as input
    console.log(this.weights_ih);
    console.log(input);
    let hidden_output = this.weights_ih.multiply(input);

    console.log(this.bias_h);
    console.log(hidden_output);

    hidden_output = hidden_output.add(this.bias_h);

    hidden_output = hidden_output.mapit(sigmoid);

    let final_output = this.weights_ho.multiply(hidden_output);

    final_output = final_output.add(this.bias_o);

    final_output = final_output.mapit(sigmoid);

    return final_output;
  }

  feedforward_backprop(input, true_value) {
    let hidden_output = this.weights_ih.multiply(input);

    hidden_output = hidden_output.add(this.bias_h);
    hidden_output = hidden_output.mapit(sigmoid);

    let final_output = this.weights_ho.multiply(hidden_output);

    final_output = final_output.add(this.bias_o);

    final_output = final_output.mapit(sigmoid);

    // back propagate
    var learning_rate = 0.1;
    //calculate change in ho weights and bias

    let output_error = true_value.subtract(final_output);

    let ph_1 = output_error.multiply(learning_rate);

    let diff_output = final_output.mapit(diff_sigmoid);

    let gradient1 = diff_output.hadamard_product(ph_1);

    let transpose_ho = hidden_output.transpose();

    let delta_weights_ho = gradient1.multiply(transpose_ho);

    let delta_bias_o = gradient1;

    this.weights_ho = this.weights_ho.add(delta_weights_ho);

    this.bias_o = this.bias_o.add(delta_bias_o);

    let transpose_who_1 = this.weights_ho;
    let transpose_who = transpose_who_1.transpose();

    let hidden_error = transpose_who.multiply(output_error);

    let ph_2 = hidden_error.multiply(learning_rate);
    let diff_h_output = hidden_output.mapit(diff_sigmoid);
    let gradient2 = diff_h_output.hadamard_product(ph_2);

    let transpose_ih = input.transpose();

    let delta_weights_ih = gradient2.multiply(transpose_ih);
    let delta_bias_h = gradient2;

    this.weights_ih = this.weights_ih.add(delta_weights_ih);
    this.bias_h = this.bias_h.add(delta_bias_h);
  }
}
