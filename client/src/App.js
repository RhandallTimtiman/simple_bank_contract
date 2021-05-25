import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import HanTokenContract from "./contracts/HanToken.json";
import dBankTokenContract from "./contracts/dBank.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    token: null,
    dbank: null,
    balance: 0,
    dBankAddress: null,
    account: "",
    tokenContract: null,
    dBankContract: null,
    depositAmount: 0,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      const balance = await web3.eth.getBalance(accounts[0]);

      console.log(balance, "Here is the balance");

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const tokenNetwork = HanTokenContract.networks[networkId];
      const dBankNetwork = dBankTokenContract.networks[networkId];

      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const tokenInstance = new web3.eth.Contract(
        HanTokenContract.abi,
        tokenNetwork && tokenNetwork.address
      );

      const dBankInstance = new web3.eth.Contract(
        dBankTokenContract.abi,
        dBankNetwork && dBankNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          web3,
          accounts,
          contract: instance,
          account: accounts[0],
          tokenContract: tokenInstance,
          dBankContract: dBankInstance,
        }
        // this.runExample
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  async deposit() {
    console.log("here in deposit");
    console.log(this.state.depositAmount);
    let amount = this.state.depositAmount;
    amount = amount * 10 ** 18;
    if (this.state.dBankContract !== "undefined") {
      try {
        this.state.dBankContract.methods.deposit().send({
          value: amount.toString(),
          from: this.state.account,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async withdraw() {
    console.log("inside the withdraw function");
    if (this.state.dBankContract !== "undefined") {
      try {
        this.state.dBankContract.methods.withdraw().send({
          from: this.state.account,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Welcome to DBank!</h1>
        <h1>Hi {this.state.account}</h1>

        <hr></hr>
        <h1>How much do you want to deposit?</h1>
        <input
          onChange={(e) => {
            this.setState({
              depositAmount: e.target.value,
            });
          }}
          type="number"
          step="0.01"
          placeholder="Minimum 0.01 Ether"
        ></input>
        <br></br>
        <button onClick={() => this.deposit()}>Deposit</button>
        <hr></hr>
        <h1>Do you want to withdraw now? (This also includes the interest)</h1>
        <br></br>
        <button onClick={() => this.withdraw()}>Withdraw</button>
      </div>
    );
  }
}

export default App;
