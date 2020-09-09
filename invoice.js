
window.onload=()=>{
let params = new URLSearchParams(window.location.search)
var obj
if(params.has("id")){
    console.log(Number(params.get("id")))
    var local=JSON.parse(localStorage.getItem('invoice'))

    for(i in local){
        if(local[i].id==params.get("id")){
        obj = local[i]
        
        }
        else {
    console.log("not found")
    }
}

    invoiceTemplate(obj)
}
else{
    invoiceTemplate()
}
}





function invoiceTemplate(obj){

            var bt = document.getElementById("add")
            var rm = document.getElementById("remove")
            var pr = document.getElementById("print")
            var tab = document.getElementById("tab")
            var inpt = document.getElementsByTagName("textarea")
            var subTot = document.getElementById("sub_tot")
            var th = document.getElementsByClassName("head")
            var tot = document.getElementById("tot");
            var invNum=document.getElementById("invNum")
            var date=document.getElementById("date")
            //on change of  rate and quantity 
            function bind() {
                $('.rate').blur(update_price);
                $('.qty').blur(update_price);
            }
            $( function() {
                $( "#date" ).datepicker({dateFormat: "dd/mm/yy"});
              } );
            // updates price and total
            function update_price() {
                var row = $(this).parents('.item-row');
                var cost = row.find('.rate').val();
                var qty = row.find('.qty').val();
                //console.log(row,cost,qty)
                // console.log(row.find('.price'))
                row.find('.price').val(Number(qty) * Number(cost));
                subTot.textContent = "Sub Total: " + summing();
                tot.textContent="Total: "+summing()*1.5;

            }

            var addRowWithData=({item,quantity,rate,price})=>{
                var tr = document.createElement("tr");
                tr.setAttribute("class", "item-row")
                var tbody = document.createElement("tbody")
                var td1, inp, j

                for (var i = 0; i < th.length; i++) {
                    td1 = document.createElement("td");
                    inp = document.createElement("textarea")
                    td1.appendChild(inp);
                    tr.appendChild(td1)
                }

                tab.appendChild(tr)
                inpt[inpt.length-4].value=item
                inpt[inpt.length-3].value=quantity
                inpt[inpt.length-2].value=rate
                inpt[inpt.length-1].value=price
                //inpt[inpt.length-2].oninput=inptchange
                inpt[inpt.length - 3].setAttribute("class", "qty")
                
                // inpt[inpt.length-3].oninput=inptchange
                inpt[inpt.length - 2].setAttribute("class", "rate")
                inpt[inpt.length - 1].setAttribute("class", "price")
                bind()
               
            }
            



            //add  table input rows
            var addRow = () => {
                var tr = document.createElement("tr");
                tr.setAttribute("class", "item-row")
                var tbody = document.createElement("tbody")
                var td1, inp

                for (var i = 0; i < th.length; i++) {
                    td1 = document.createElement("td");
                    inp = document.createElement("textarea");
                    td1.appendChild(inp);
                    tr.appendChild(td1)
                    console.log(i)
                }


                tab.appendChild(tr)
                //inpt[inpt.length-2].oninput=inptchange
                inpt[inpt.length - 3].setAttribute("class", "qty")
                // inpt[inpt.length-3].oninput=inptchange
                inpt[inpt.length - 2].setAttribute("class", "rate")
                inpt[inpt.length - 1].setAttribute("class", "price")

                

            }
            //   print [page]
            document.getElementById("print").addEventListener("click",printIt = () => {
                console.log(inpt)
                bt.style.visibility = 'hidden'
                rm.style.visibility = 'hidden'
                pr.style.visibility = 'hidden'
                document.getElementById("SAVE").style.visibility="hidden"
                document.getElementById("view").style.visibility="hidden"
                window.print();
                bt.style.visibility = 'visible'
                rm.style.visibility = 'visible'
                pr.style.visibility = 'visible'
                document.getElementById("SAVE").style.visibility='visible'
                document.getElementById("view").style.visibility="visible"

            })

            document.getElementById("add").addEventListener("click",
            async function adding() {
                await addRow();
                bind();
            })

            //summing the price column
            function summing() {
                sum = 0
                for (i = 5; i < inpt.length; i = i + 4) {
                    //console.log(inpt[i].value)
                    if (inpt[i].value == "") {
                        inpt[i].value = 0;
                    }
                    sum = sum + parseFloat(inpt[i].value)
                }
                return sum;
            }
            //remove table rows
            rm.addEventListener("click",
                function() {
                    if (tab.childNodes.length > 2) {
                        //console.log(inpt[inpt.length - 1].value)
                        if (inpt[inpt.length - 1].value != "") {
                            tab.removeChild(tab.lastChild);
                            subTot.textContent = "Sub Total: " + summing();
                            tot.textContent="Total: "+summing()*1.5;
                        }
                        else {
                            tab.removeChild(tab.lastChild);
                        }
                    }
                }
            )


            

            

           

            //SAVE FUNCTION
            data=[]
            document.getElementById("SAVE").addEventListener("click",function Save(){

                for (i = 5; i < inpt.length; i = i+4) {
                    
                    console.log(inpt[i-2].value,inpt[i-1].value)
                    // table row object
                    tableRows={
                        item:inpt[i-3].value,
                        quantity:inpt[i-2].value,
                        rate:inpt[i-1].value,
                        price:inpt[i].value
                    }
                    data.push(tableRows)
                }
                    //invoice object
                    invoice={
                        id:Number(invNum.value),
                        date:date.value,
                        data,
                        total:summing()*1.5,
                        subtotal:summing(),
                        tax:1.5
                    
                }
                if(invoice.total===0){
                    console.log("No data")
                }else{
                if(localStorage.getItem('invoice')){
                    old=JSON.parse(localStorage.getItem('invoice'))
                    console.log(old)
                    old.push(invoice)
                localStorage.setItem(`invoice`,JSON.stringify(old))
            }
            else{
                localStorage.setItem(`invoice`,JSON.stringify([invoice]))
            }
                console.log(JSON.parse(localStorage.getItem('invoice')))
        }
            })




            if(obj){
                console.log(Object.keys(data).length)
         
                obj.data.map((data)=>{
                   addRowWithData(data)
                   
                })
                subTot.textContent = "Sub Total: " + obj.subtotal;
                tot.textContent="Total: "+obj.total;
                invNum.value=obj.id
                date.value=obj.date
            }
            else{
                console.log("")
            }
}