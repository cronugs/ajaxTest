//5. getData is called from the writeToDocument() function. It is called with the url and a callback function, which formats and renders 
//data into a table.
function getData(url, cb) {
    //we set a new XMLHttpRequest to the variable xhr
    var xhr = new XMLHttpRequest();

    //6. we set onredystatechange to an annon function which tests the status of the data from the API
    xhr.onreadystatechange = function() {
        //7. if the ready state is 4 and the status is 200
        if (this.readyState == 4 && this.status == 200) {
            //8. we call our callback function in the getData call and parse is as JSON data. The data held in this.responseText
            //(xhr.responseText) is passed back into the the writeToDocument function.
            cb(JSON.parse(this.responseText));
        }
    };
    //I'm not sure what these lines do!
    xhr.open("GET", url);
    xhr.send();
}

function getTableHeaders(obj) {
    var tableHeaders = [];

    Object.keys(obj).forEach(function(key) {
        tableHeaders.push(`<td>${key}</td>`);
    });

    return `<tr>${tableHeaders}</tr>`;
}

function generatePaginationButtons(next, prev) {
    if (next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>
                <button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (next && !prev) {
        return `<button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (!next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>`;
    }
}


//1. this is where we enter after the button is pressed and the url is passed as a parameter into the writeToDocument function
function writeToDocument(url) {
    //2. we create an empty var tableRows to store our table
    var tableRows = [];
    //3. we create a var el that refers to the div #data 
    var el = document.getElementById("data");
    //4. we call getData, which triggers a callback that puts the JSON data into the data variable.
    getData(url, function(data) {
        //we set pagination to an empty string
        var pagination = "";
        //We will pick up here when we can.
        if (data.next || data.previous) {
            pagination = generatePaginationButtons(data.next, data.previous);
        }
        data = data.results;
        var tableHeaders = getTableHeaders(data[0]);

        data.forEach(function(item) {
            var dataRow = [];

            Object.keys(item).forEach(function(key) {
                var rowData = item[key].toString();
                var truncatedData = rowData.substring(0, 15);
                dataRow.push(`<td>${truncatedData}</td>`);
            });
            tableRows.push(`<tr>${dataRow}</tr>`);
        });

        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "");
    });
}