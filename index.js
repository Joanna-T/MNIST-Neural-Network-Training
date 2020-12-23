var training_image_values = [];
var test_image_values = [];
var grid = [];

var number_neuralnetwork = new NeuralNetwork(784, 300, 10);
var trained = false;

var image_num = 1001;

$.ajax({
  url: "mnist_train.csv",
  dataType: "text",
}).done(parse_data);

function parse_data(data) {
  //console.log("success");

  var images = data.split(/\r?\n|\r/);
  var image_values = [];
  console.log(images[0]);
  for (let i = 0; i < images.length; i++) {
    let temp_number_image = images[i].split(",");
    let number_image = [];
    for (let j = 0; j < temp_number_image.length; j++) {
      number_image.push(parseInt(temp_number_image[j]));
    }
    image_values.push(number_image);
  }
  console.log(image_values[0][1]);
  console.log(image_values.length);
  training_image_values = image_values;
    if (trained) {
    test_data(test_image_values);
  } else {
    train_data(train_image_values);
    load_test_data();
  }
}

function train_data(image_array) {
  console.log("Training function start");
  console.log(image_array[image_array.length - 2]);
  for (let i = 0; i < image_array.length - 1; i++) {
    console.log("Training data number:", i);
    //convert answer to matrix form
    let correct_ans = [];
    for (let j = 0; j < 10; j++) {
      correct_ans.push([0]);
    }
    correct_ans[image_array[i][0]][0] = 1;
    let correct_ans_m = new Matrix(correct_ans.length, 1);
    correct_ans_m.arrayToMatrix(correct_ans);
    //convert input to matrix form
    let image_pixel_values = [];
    for (let j = 1; j < image_array[i].length; j++) {
      image_pixel_values.push([image_array[i][j]]);
    }
    let image_pixel_values_m = new Matrix(image_pixel_values.length, 1);
    image_pixel_values_m.arrayToMatrix(image_pixel_values);

    number_neuralnetwork.feedforward_backprop(
      image_pixel_values_m,
      correct_ans_m
    );
  }
  trained = true;
}

function load_test_data() {
  $.ajax({
    url: "mnist_test.csv",
    dataType: "text",
  }).done(parse_data);
}

function test_data(image_array) {
  debugger;
  console.log("Test function start");
  let correct_ans = [];

  for (let i = 0; i < image_array.length - 1; i++) {
    console.log("Test data number", i);
    var selected_image = image_array[i];

    let selected_image_arr = [];
    for (let j = 1; j < selected_image.length; j++) {
      selected_image_arr.push([selected_image[j]]);
    }
    //debugger;
    let selected_image_m = new Matrix(selected_image_arr.length, 1);
    selected_image_m.arrayToMatrix(selected_image_arr);
    var output = number_neuralnetwork.feedforward(selected_image_m);
    let number_index = -1;
    let highest = -Infinity;
    for (let j = 0; j < output.matrix.length; j++) {
      if (output.matrix[j][0] > highest) {
        highest = output.matrix[j][0];

        number_index = j;
      }
    }
    let answer_pairs = {};
    answer_pairs[image_array[i][0]] = number_index;
    correct_ans.push(answer_pairs);
  }

  let errors = 0;
  debugger;
  for (let i = 0; i < correct_ans.length; i++) {
    console.log(
      "Correct answer:",
      correct_ans[i][Object.keys(correct_ans[i])[0]],
      "NN answer:",
      Object.keys(correct_ans[i])[0]
    );

    if (
      correct_ans[i][Object.keys(correct_ans[i])[0]] !=
      Object.keys(correct_ans[i])[0]
    ) {
      errors++;
    }
  }

  let accuracy = (10000 - errors) / 10000;
  console.log("The final accuracy of the neural network is", accuracy);
  console.log(
    "Final output neural network stored in variable: number_neuralnetwork"
  );

  //return output
}
