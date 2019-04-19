//5. getData is called from the writeToDocument() function. It is called with the url and a callback function, which formats and renders 
//data into a table.
function getData(url, cb) {
    //we set a new XMLHttpRequest to the variable xhr
    var xhr = new XMLHttpRequest();

    //6. we set onredystatechange to an annon function which tests the status of the data from the API
    xhr.onreadystatechange = function() {
        //7. if the ready state is 4 and the status is 200
        if (this.readyState == 4 && this.status == 200) {
            //8. we call our callback function in the getData call and parse it as JSON data. The data held in this.responseText
            //(xhr.responseText) is passed back into the the writeToDocument function.
            cb(JSON.parse(this.responseText));
        }
    };
    //I'm not sure what these lines do!
    xhr.open("GET", url);
    xhr.send();
}

//Continue from here
function getTableHeaders(obj) {
    var tableHeaders = [];

    console.log(Object.keys(obj));
    

    Object.keys(obj).forEach(function(key) {
        console.log(key);
        
        tableHeaders.push(`<td>${key}</td>`);
    });

    return `<tr>${tableHeaders}</tr>`;
}

//11. generatePaginationButtons is called from the getData function and takes two arguments, next and prev.
//which will be either a url or null
function generatePaginationButtons(next, prev) {
    //12. if both next and prev are a url;
    if (next && prev) {
        //13. return code to create both a next and prev button to more through pages of results.
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
        //9. we set pagination to an empty string
        var pagination = "";
        //10. Our if statement returns true if either the next or previous values in out data are not null.
        if (data.next || data.previous) {
            //11. if our if statement returns true, we create a variable; pagination and pass in out data.next
            //and data.previous variable which are either a url, or null.
            pagination = generatePaginationButtons(data.next, data.previous);
        }
        //console.log(data.count);
        //console.log(data.next);
        //console.log(data.previous);
        //console.log(data.results);
        //14. data.results is the meat of our data. Here we assign it to the variable data.
        data = data.results; 
        console.log(data[0]);

        //15. create a variable tableHeaders and assign it the return value of the getTableHeaders function
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