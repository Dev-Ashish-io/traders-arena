(()=>{function e(){fetch("https://backend-0qxg.onrender.com/teams").then((e=>e.json())).then((e=>{document.querySelector(".teams-container").innerHTML=e.map((e=>'\n              <div class="team-card fade-in">\n                  <h3>'.concat(e.name,"</h3>\n                  <p>\ud83d\udcb0 Money: $").concat(e.money.toFixed(2),"</p>\n                  <p>\ud83d\udcc8 Stocks: ").concat(JSON.stringify(e.stocks),"</p>\n              </div>\n          "))).join("")})).catch((e=>{t("Error fetching teams: "+e.message)}))}function t(e){document.getElementById("errorMessage").textContent=e,document.getElementById("errorModal").classList.remove("hidden")}document.getElementById("transactionForm").addEventListener("submit",(function(n){n.preventDefault();const a={team_id:document.getElementById("teamId").value,stock_name:document.getElementById("stockName").value,quantity:parseInt(document.getElementById("quantity").value,10),price:parseFloat(document.getElementById("price").value),action:document.getElementById("action").value};fetch("https://backend-0qxg.onrender.com/transactions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then((e=>e.json())).then((n=>{n.success?(e(),document.getElementById("transactionModal").classList.remove("hidden")):t("Transaction failed: "+n.message)})).catch((e=>{t("Transaction error: "+e.message)}))})),document.getElementById("closeModal").addEventListener("click",(()=>{document.getElementById("transactionModal").classList.add("hidden")})),document.getElementById("closeErrorModal").addEventListener("click",(()=>{document.getElementById("errorModal").classList.add("hidden")})),e()})();
//# sourceMappingURL=main.5673c9fa.js.map