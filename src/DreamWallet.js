import React, {useState, useEffect} from 'react'
import {v4 as uuid} from 'uuid'
import CryptoCard from './CryptoCard'

// 

function DreamWallet({}) {
  const [DreamBTCAmount, setDreamBTCAmount] = useState(null);
  const [BTCPrice, setBTCPrice] = useState(null)
  const [DreamEthAmount, setDreamEthAmount] = useState (null);
  const [EthPrice, setEthPrice] = useState(null);
  let [arrayName, setArrayName] = useState(null)
  let BTCTotal = DreamBTCAmount * BTCPrice;
  let EthTotal = DreamEthAmount * EthPrice;
  let TotalValue = EthTotal + BTCTotal

  let [cardArray, setCardArray] = useState([])


  useEffect(() => {
    fetch('http://localhost:8001/cryptoCard')
    .then(resp => resp.json())
    .then(card => {
      setCardArray(card)
    })
  }, [])


  function handleAddToJson() {
    console.log("hello")
    let newObj = {
      id: uuid(),
      DreamEthAmount: DreamEthAmount,
      DreamBTCAmount: DreamBTCAmount,
      EthTotal: EthTotal,
      BTCTotal: BTCTotal,
      name: arrayName,
      total: TotalValue

    }
    fetch('http://localhost:8001/cryptoCard', {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(newObj)
  })
    .then(resp => resp.json())
    .then(data=>{
      setCardArray([...cardArray, data]);
    })
    }

    

    let mappedArray = cardArray.map(card => {
      return (
        <CryptoCard 
        key={card.id}
        card={card}
        handleDelete={handleDelete}
        />
      )
    })

    function handleDelete(card) {
      fetch('http://localhost:8001/cryptoCard/'+card.id, {
        method: "DELETE",
        headers: {
        'Content-type': 'application/json; charset=UTF-8'
        },
    })
    let cardItemIndex = cardArray.indexOf(card)
    if(cardItemIndex > -1) {
      let newArray = [...cardArray]
      newArray.splice(cardItemIndex, 1)
      setCardArray(newArray)
    }
    }


  function handleDreamBTCBase (event) {
    setDreamBTCAmount(event.target.value)
  }

  function handleDreamBTCMultiplication (event) {
  setBTCPrice(event.target.value) 
  }

  function handleEthBase (event) {
    setDreamEthAmount(event.target.value);

  }

  function handleEthMultiplication (event) {
    setEthPrice(event.target.value);
  }

  function addNameToArray(event) {
    setArrayName(event.target.value)
  }

  function formatPrice(dollars){
    return dollars.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }

  return (
    <>

      <div id='dreamWallet'> 
        <div id="Form">
            <h2 id="DreamWalletHeading">Dream Wallet</h2>
            <h4 id="DreamWalletHeading1"> Anything is Possible  </h4>
            <h4 id="createAlternatives"> Every good idea began with a first step, here's a place to take yours. </h4>
            <h4 id="createAlternatives"> Use this space to not just chart your dreams but to forge a promise on how you'll obtain them. </h4>
            <div id="dreamForms">

              <div id='dreamInputs'>
                <div>
                  <input type="text" id="userWalletInput1" name="fname" placeholder="Enter Dream Amount BTC" onChange={handleDreamBTCBase}></input>
                  <input id='userWalletInput2' placeholder='Set Dream BTC Price' onChange={handleDreamBTCMultiplication}></input>
                </div>
                <div>
                  <input type="text" id="userWalletInput1" name="lname" placeholder="Enter Dream Amount ETH" onChange={handleEthBase}></input>
                  <input id='userWalletInput2' placeholder='Set Dream ETH Price' onChange={handleEthMultiplication}></input>
                </div>
              </div>

              <div id="dreamDollarValueChart">
                  <h3>Dollar Value</h3>
                  <p> Your Current BTC Holdings <br></br>{formatPrice(BTCTotal)}</p>
                  <p> Your Current ETH Holdings <br></br> {formatPrice(EthTotal)}</p>
                  <h4> Current Wallet Total = {formatPrice(TotalValue)}</h4>
                
                  <label className='Name'>Name of Portfolio  </label> 
                  <input className='Name' type='text' placeholder='Name me' onChange={addNameToArray} id='inputPortfolioName'></input>
                  <br /><br />
                  <button className='btn btn-primary' onClick={handleAddToJson}>Create Card</button>
              </div>
            </div>
        <div id="problemChildDiv">
          {mappedArray}
        </div>
       
      </div>
      </div> 
    </>
  )
}

export default DreamWallet;