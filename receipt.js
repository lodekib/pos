const { PosPrinter } = require("electron-pos-printer");
const path = require("path");

var date = Date()

    function print(){
      const options = {
        preview: false,             // Preview in window or print
        width: '200px',               //  width of content body
        margin: '10 10 10 10',
        copies: 1,
        silent:false,                 // Number of copies to print
        printerName: 'XP-80C',        // printerName: string, check with webContent.getPrinters()
        pageSize: { height: 400, width: 200 }  // page size
    }

    const data = [
        {
            type: 'image',
            path: path.join(__dirname, 'assets/splash.png'),     // file path
            position: 'center',                                  // position of image: 'left' | 'center' | 'right'
            width: '60px',                                           // width of image in px; default: auto
            height: '60px',                                          // width of image in px; default: 50 or '50px'
        }, {
            type: 'text',
            position:'left',                                    // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
            value: 'Sales Receipt',
            style: `text-align:center;`,
            css: { "font-weight": "700", "font-size": "18px" }
        }, {
            type: 'text',
            position:'right',                   // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
            value:(new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " "),
            style: `color: black;`,
            css: { "text-decoration": "underline", "font-size": "10px" }
        }, {
            type: 'text',
            position: 'center',
            value: 'SPLASH BUSINESS HUB LIMITED',
            style: `color:black;font-size:22px`,
    
        },
        {
            type: 'text',
            position: 'center',
            value: 'P.O Box 2535 - 90100',
            style: `color:black;font-size:15px`,

        },
        {
            type: 'text',
            position: 'center',
            value: 'Machakos, Kenya',
            style: `color:black;font-size:15px`,

        },
        {
            type: 'text',
            position: 'center',
            value: 'Phone : 0729635254/0737680634',
            style: `color:black;font-size:15px`,

        },
        {
            type: 'text',
            position: 'center',
            value: 'Email : splashbusinesshub@gmail.com',
            style: `color:black;font-size:15px`,

        },
        {
            type: 'text',
            position: 'center',
            value: 'Website : www.splashbusinesshub.co.ke',
            style: `color:black;font-size:15px`,

        },
        {
            type: 'text',
            position: 'center',
            value: 'KBL 546X',
            style: `color:black;font-size:25px`,

        },
        {
            type: 'table',
            style: 'border: 1px solid #ddd',
            tableHeader: ['Service', 'Price'],
            tableBody: [
                ['Matts clean', 200],
                ['Full body', 1000],
            ],
            tableFooter: ['Welcome again, Served by Jeremy'],
            tableHeaderStyle: 'background-color: #000; color: black;',
            tableBodyStyle: 'border: 0.5px solid #ddd',
            tableFooterStyle: 'background-color: #000; color: black;',
        },
    ]

    PosPrinter.print(data, options)
        .then()
        .catch((error) => {
            console.error(error);
        });
    }

module.exports = {
        print
    }

