

// Budget Controller
var budgetController = (function () {
  var Bet = function (
    id,
    potd,
    sport,
    league,
    home,
    away,
    tip,
    odds,
    stake,
    results,
    gameBalance
  ) {
    this.id = id;
    this.potd = potd;
    this.sport = sport;
    this.league = league;
    this.home = home;
    this.away = away;
    this.tip = tip;
    this.odds = odds;
    this.stake = stake;
    this.results = results;
    this.gameBalance = gameBalance;
  };

  var data = {
  allItems: [],
  budget: 0,
  plus: 0,
  minus: 0,
  push: 0,
  averageodds: 0,
  averagestake: 0,
  allstake: 0,
  bankstart: 0,
  banknow: 0,
  roi: 0,
  betsnumber: 0,
  wins: 0,
  winPercentage: 0,
  bankgrowth: 0,
};

  var calculateSum = function () {
    var sum = 0;

    data.allItems.forEach(function (current) {
      sum += current.gameBalance;
    });
    data.budget = sum;
  };

  var calculateSumStake = function () {
    var sum = 0;

    data.allItems.forEach(function (current) {
      sum += current.stake;
    });
    data.allstake = sum;
  };

  var calculateMinusPlus = function () {
    var plus = 0;
    var minus = 0;
    var push = 0;

    data.allItems.forEach(function (current) {
      if (current.gameBalance > 0) {
        plus += current.gameBalance;
      } else if (current.gameBalance < 0) {
        minus += current.gameBalance;
      } else {
        push += 1;
      }
    });
    data.plus = plus;
    data.minus = minus;
    data.push = push;
  };

  var numbersOfBets = function () {
    data.betsnumber = data.allItems.length;
  };

  var sumWins = function () {
    var sum = 0;

    data.allItems.forEach(function (current) {
      if (current.results === "W") {
        sum += 1;
      }
    });
    data.wins = sum;
  };

  var calculateWinsPercentage = function () {
    data.winPercentage = (data.wins / (data.betsnumber - data.push)) * 100;
  };

  var calculateAverageOdds = function () {
    var sum = 0;
    var average;

    data.allItems.forEach(function (current) {
      sum += current.odds;
    });
    average = sum;
    data.averageodds = average / data.betsnumber;
  };

  var calculateAverageStake = function () {
    var sum = 0;
    var average;

    data.allItems.forEach(function (current) {
      sum += current.stake;
    });
    average = sum;
    data.averagestake = average / data.betsnumber;
  };

  var calculateBankNow = function () {
    data.banknow = data.budget + data.bankstart;
  };

  var calculateRoi = function () {
    var calcroi = 0;

    calcroi = (data.budget / data.allstake) * 100;

    if (calcroi === 0) {
      data.roi = 100;
    } else {
      data.roi = calcroi;
    }
  };

  var bankGrowth = function () {
    data.bankgrowth = (data.budget / data.bankstart) * 100;
  };

  return {
    promptStartingBank: function () {
      var startbank = parseFloat(prompt("Please write your starting units."));
      startbank = Math.round((startbank + Number.EPSILON) * 100) / 100;

      if (isNaN(startbank)) {
        data.bankstart = 0;
      } else {
        data.bankstart = startbank;
      }

      data.banknow = startbank;

      if (data.banknow > 0) {
        document.querySelector(".budget_now-value").textContent =
          data.banknow + " €";
      } else {
        document.querySelector(".budget_now-value").textContent = "0 €";
      }

      document.querySelector(".budget_start-value").textContent =
        data.bankstart + " €";
    },

    addItem: function (
      potd,
      sport,
      league,
      home,
      away,
      tip,
      odds,
      stake,
      results
    ) {
      var newItem, ID;

      // create new ID
      if (data.allItems.length > 0) {
        ID = data.allItems[data.allItems.length - 1].id + 1;
      } else {
        ID = 0;
      }

      var gameBalance = 0;

      if (results === "W") {
        gameBalance = odds * stake - stake;
      } else if (results === "L") {
        gameBalance -= stake;
      } else {
        gameBalance;
      }

      // create new item

      newItem = new Bet(
        ID,
        potd,
        sport,
        league,
        home,
        away,
        tip,
        odds,
        stake,
        results,
        gameBalance
      );

      // push it into our date structure
      data.allItems.push(newItem);

      // return the new element
      return newItem;
    },

    deleteItem: function (id) {
      var ids, index;

      ids = data.allItems.map(function (current) {
        // map létrehoz egy új arrayt
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems.splice(index, 1);
      }
    },

    calculateBudget: function () {
      calculateSum();
      calculateMinusPlus();
      numbersOfBets();
      sumWins();
      calculateWinsPercentage();
      calculateAverageOdds();
      calculateAverageStake();
      calculateBankNow();
      calculateSumStake();
      calculateRoi();
      bankGrowth();
    },

    colorRes: function (id) {
      var item = ".item_results-";

      data.allItems.forEach(function (current) {
        if (current.id === id && current.gameBalance >= 0) {
          document.querySelector(item + id).classList.remove("red");
          document.querySelector(item + id).classList.add("blue");
          document.querySelector(item + id).classList.remove("red");
        } else {
          document.querySelector(item + id).classList.remove("blue");
          document.querySelector(item + id).classList.add("red");
          document.querySelector(item + id).classList.remove("blue");
        }
      });
    },

    displayTableColor: function () {
      if (data.bankgrowth >= 0) {
        document.querySelector(".bank_growth").style.backgroundColor =
          "#28B9B5";
      } else if (data.bankgrwoth < 0) {
        document.querySelector(".bank_growth").style.backgroundColor =
          "#FF5049";
      } else {
        document.querySelector(".bank_growth").style.backgroundColor =
          "#28B9B5";
      }

      if (data.banknow >= data.bankstart) {
        document.querySelector(".budget_now").style.backgroundColor = "#28B9B5";
      } else {
        document.querySelector(".budget_now").style.backgroundColor = "#FF5049";
      }

      if (data.winPercentage >= 50) {
        document.querySelector(".wins_percentage").style.backgroundColor =
          "#28B9B5";
      } else if (data.winPercentage < 50) {
        document.querySelector(".wins_percentage").style.backgroundColor =
          "#FF5049";
      } else {
        document.querySelector(".wins_percentage").style.backgroundColor =
          "#28B9B5";
      }

      if (data.roi < 0) {
        document.querySelector(".roi").style.backgroundColor = "#FF5049";
      } else {
        document.querySelector(".roi").style.backgroundColor = "#28B9B5";
      }

      if (data.budget >= 0) {
        document.querySelector(".real_profit").style.backgroundColor =
          "#28B9B5";
      } else {
        document.querySelector(".real_profit").style.backgroundColor =
          "#FF5049";
      }
    },

    getBudget: function () {
      return {
        // left side
        budgetStart: data.bankstart,
        picks: data.betsnumber,
        averagestake: data.averagestake,
        plus: data.plus,
        //middle
        budgetnow: data.banknow,
        wins: data.wins,
        averageodds: data.averageodds,
        minus: data.minus,
        //right
        bankgrowth: data.bankgrowth,
        winpercentage: data.winPercentage,
        roi: data.roi,
        budget: data.budget,
      };
    },
  };
})();

// UI Controller
var UIController = (function () {
  var DOMstrings = {
    //inputs
    inputPOTD: ".add_potd",
    inputSport: ".add_sport",
    inputLeague: ".add_league",
    inputHome: ".add_home_team",
    inputAway: ".add_away_team",
    inputTip: ".add_bet_tip",
    inputOdds: ".add_odds",
    inputStake: ".add_stake",
    inputResults: ".add_game_results",
    inputBtn: ".add_btn",
    //list
    betList: ".bet_list",
    container: ".container",
    listsport: ".sport",
    item_res: ".item_results",
    //labels
    budgetLabel: ".real_profit-value",
    incomeLabel: ".budget_income-value",
    lossLabel: ".budget_loss-value",
    budgetStartLabel: ".budget_start-value",
    picksLabel: ".number_picks-value",
    averagestakeLabel: ".average_stake-value",
    budgetnowLabel: ".budget_now-value",
    winsLabel: ".number_wins-value",
    averageoddsLabel: ".average_odds-value",
    bankgrowthLabel: ".bank_growth-value",
    winpercentageLabel: ".wins_percentage-value",
    roiLabel: ".roi-value",
  };

  nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var Sports = {
    football: ["Bundesliga", "Premier League", "Seria A", "La Liga", "Ligue 1"],
    basketball: ["LNB", "BBL", "ACB", "NBA", "NCAA"],
  };

  var Leagues = {
    football_Bundesliga: [
      "Augsburgb",
      "Bayer Leverkusen",
      "Bayern München",
      "Dortmund",
      "Mönchengladbach",
      "Frankfurt",
      "Düsseldorf",
      "Freiburg",
      "Hertha BSC",
      "Hoffenheim",
      "Köln",
      "RB Leipzeg",
      "Mainz",
      "Paderborn",
      "Schalke 04",
      "Union Berlin",
      "Werder Bremen",
      "Wolfsburg",
    ],
    football_Premierleague: [
      "Arsenal",
      "Aston Villa",
      "Bournemouth",
      "Brighton",
      "Burnley",
      "Chelsea",
      "Crystal Palace",
      "Everton",
      "Leicester City",
      "Liverpool",
      "Manchester City",
      "Manchester United",
      "Newcastle United",
      "Norwich City",
      "Sheffield United",
      "Southampton",
      "Tottenham",
      "Watford",
      "West Ham",
      "Wolves",
    ],
    football_SeriaA: [
      "AC Milan",
      "AS Roma",
      "Atalanta",
      "Bologna",
      "Brescia",
      "Cagliari",
      "Fiorentina",
      "Genoa",
      "Inter Milan",
      "Juventus",
      "Lazio",
      "Lecce",
      "Napoli",
      "Parma",
      "Sampdoria",
      "Sassuolo",
      "Spal",
      "Torino",
      "Udinese",
      "Verona",
    ],
    football_LaLiga: [
      "Alaves",
      "Athletic Bilbao",
      "Atletico Madrid",
      "Barcelona",
      "Betis",
      "Celta Vigo",
      "Eibar",
      "Espanyol",
      "Getafe",
      "Granada",
      "Leganes",
      "Levante",
      "Mallorca",
      "Osasuna",
      "Real Madrid",
      "Real Sociedad",
      "Sevilla",
      "Valencia",
      "Valladolid",
      "Villarreal",
    ],
    football_LigueUne: [
      "Amiens",
      "Angers",
      "Bordeaux",
      "Brest",
      "Dijon",
      "Lille",
      "Lyon",
      "Metz",
      "Monaco",
      "Montpellier",
      "Nantes",
      "Nice",
      "Nimes",
      "Olympique de Marseille",
      "PSG",
      "Reims",
      "Rennes",
      "St. Etienne",
      "Strasbourg",
      "Toulouse",
    ],
    basketball_France: [
      "Boulazac",
      "Chalon/Saone",
      "Chalons-Reims",
      "Cholet",
      "Dijon",
      "Elan Bearnais",
      "Gravelines-Dunkerque",
      "JL Bourg",
      "Le Mans",
      "Le Portel",
      "Levallois",
      "Limoges",
      "Lyon-Villeurbanne",
      "Monaco",
      "Nanterre",
      "Orleans",
      "Roanne",
      "Strasbourg",
    ],
    basketball_German: [
      "Alba Berlin",
      "Bamberg",
      "Bayern",
      "Bayreuth",
      "Bonn",
      "Braunschweig",
      "Crailsheim Merlins",
      "Frankfurt",
      "Giessen",
      "Göttingen",
      "Hamburg",
      "Ludwigsburg",
      "Mitteldeutscher",
      "Oldenburg",
      "s.Oliver Würzburg",
      "Ulm",
      "Vechta",
    ],
    basketball_Spanish: [
      "Barcelona",
      "Baskonia",
      "Bilbao",
      "Estudiantes",
      "Fuenlabrada",
      "Gran Canaria",
      "Joventut Badalona",
      "Manresa",
      "MoraBanc Andorra",
      "Murcia",
      "Obradoiro CAB",
      "Pamesa Valencia",
      "Real Betis",
      "Real Madrid",
      "San Pablo Burgos",
      "Tenerife",
      "Unicaja Malaga",
      "Zaragoza",
    ],
    basketball_NBA: [
      "Dallas Mavericks",
      "Denver Nuggets",
      "Golden State Warriors",
      "Houston Rockets",
      "Los Angeles Clippers",
      "Los Angeles Lakers",
      "Memphis Grizzlies",
      "Minnesota Timberwolves",
      "New Orleans Pelicans",
      "Oklahoma City Thunder",
      "Phoenix Suns",
      "Portland Trail Blazers",
      "Sacramento Kings",
      "San Antonio Spurs",
      "Utah Jazz",
    ],
    basketball_NCAA: [
      "Butler",
      "Creighton",
      "Depaul",
      "Georgetown",
      "Marquette",
      "Providence",
      "Seton Hall",
      "St. Johns",
      "Villanova",
      "Xavier",
    ],
  };

  var formatNumber = function (num) {
    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");

    int = numSplit[0];
    if (int.length > 3) {
      int =
        int.substr(0, int.length - 3) +
        "," +
        int.substr(int.length - 3, int.length);
    }

    dec = numSplit[1];

    return int + "." + dec;
  };

  var formatNumberOnlyDecimal = function (num) {
    num = Math.round((num + Number.EPSILON) * 100) / 100;

    return num;
  };

  var resultsHelper = function (result) {
    var newResult;
    if (result === "W") {
      newResult = "Win";
    }
    if (result === "L") {
      newResult = "Lose";
    }
    if (result === "P") {
      newResult = "Push";
    }

    return newResult;
  };

  var balanceFormat = function (balance) {
    balance = balance.toFixed(2);
    if (balance > 0) {
      balance = "+" + balance + " €";
    } else if (balance < 0) {
      balance = balance + " €";
    } else {
      balance = "Push";
    }
    return balance;
  };

  var makeStandard = function (input, text) {
    var options = document.querySelector(input).options;
    var text = (options[0].text = text);
    var value = (options[0].value = "placerholder");
    var disabled = (options[0].disabled = true);
  };

  var chooseDisabled = function (input) {
    var options = document.querySelector(input).options;
    var selected = (options[0].selected = true);
    document.querySelector(input).disabled = true;
  };

  var chooseSelected = function (input) {
    var options = document.querySelector(input).options;
    var selected = (options[0].selected = true);
  };

  var orange = function () {
    document.querySelector(DOMstrings.inputBtn).classList.remove("green");
    document.querySelector(DOMstrings.inputBtn).classList.add("orange");
    document.querySelector(DOMstrings.inputBtn).classList.remove("green");

    var fields = document.querySelectorAll(
      DOMstrings.inputPOTD +
        "," +
        DOMstrings.inputSport +
        "," +
        DOMstrings.inputLeague +
        "," +
        DOMstrings.inputHome +
        "," +
        DOMstrings.inputAway +
        "," +
        DOMstrings.inputTip +
        "," +
        DOMstrings.inputOdds +
        "," +
        DOMstrings.inputStake +
        "," +
        DOMstrings.inputResults
    );

    nodeListForEach(fields, function (current) {
      current.classList.remove("green-focus");
      current.classList.add("orange-focus");
      current.classList.remove("green-focus");
    });
  };

  var green = function () {
    document.querySelector(DOMstrings.inputBtn).classList.remove("orange");
    document.querySelector(DOMstrings.inputBtn).classList.add("green");
    document.querySelector(DOMstrings.inputBtn).classList.remove("orange");
    document.querySelector(DOMstrings.inputBtn).classList.remove("orange");

    var fields = document.querySelectorAll(
      DOMstrings.inputPOTD +
        "," +
        DOMstrings.inputSport +
        "," +
        DOMstrings.inputLeague +
        "," +
        DOMstrings.inputHome +
        "," +
        DOMstrings.inputAway +
        "," +
        DOMstrings.inputTip +
        "," +
        DOMstrings.inputOdds +
        "," +
        DOMstrings.inputStake +
        "," +
        DOMstrings.inputResults
    );

    nodeListForEach(fields, function (current) {
      current.classList.remove("orange-focus");
      current.classList.add("green-focus");
      current.classList.remove("orange-focus");
    });
  };

  var getleague = function (league, sport) {
    var html, newhtml, element, index;

    element = DOMstrings.inputLeague;
    html = document.querySelector(DOMstrings.inputLeague).innerHTML =
      "<option value=%sport%-%id%>%league%</option>";

    for (var i = 0; i < league.length; i++) {
      index = league.indexOf(league[i]);

      newhtml = html.replace("%sport%", sport);
      newhtml = newhtml.replace("%id%", index);
      newhtml = newhtml.replace("%league%", league[i]);

      document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);
    }

    makeStandard(element, "Choose League");
  };

  var getHomeTeam = function (home, league) {
    var html, newhtml, element, index;

    element = DOMstrings.inputHome;
    html = document.querySelector(DOMstrings.inputHome).innerHTML =
      "<option value=%league%-%id%>%home%</option>";

    for (var i = 0; i < home.length; i++) {
      index = home.indexOf(home[i]);

      newhtml = html.replace("%league%", league);
      newhtml = newhtml.replace("%id%", index);
      newhtml = newhtml.replace("%home%", home[i]);
      document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);
    }

    makeStandard(element, "Home Team");
  };

  var getAwayTeam = function (away, league) {
    var html, newhtml, element, index;

    element = DOMstrings.inputAway;
    html = document.querySelector(DOMstrings.inputAway).innerHTML =
      "<option value=%league%-%id%>%away%</option>";

    for (var i = 0; i < away.length; i++) {
      index = away.indexOf(away[i]);

      newhtml = html.replace("%league%", league);
      newhtml = newhtml.replace("%id%", index);
      newhtml = newhtml.replace("%away%", away[i]);
      document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);
    }

    makeStandard(element, "Away Team");
  };

  return {
    getDOMstrings: function () {
      return DOMstrings;
    },

    changedSportType: function () {
      var sportValue, html;

      sportValue = document.querySelector(DOMstrings.inputSport).value;

      if (sportValue === "football") {
        getleague(Sports.football, "football");
        chooseDisabled(DOMstrings.inputHome);
        chooseDisabled(DOMstrings.inputAway);
        green();
      } else if (sportValue === "basketball") {
        getleague(Sports.basketball, "basketball");
        chooseDisabled(DOMstrings.inputHome);
        chooseDisabled(DOMstrings.inputAway);
        orange();
      }
    },

    changedLeagueType: function () {
      var leagueValue, sportValue;

      leagueValue = document.querySelector(DOMstrings.inputLeague).value;
      sportValue = document.querySelector(DOMstrings.inputSport).value;

      if (leagueValue === "football-0" && sportValue === "football") {
        getHomeTeam(Leagues.football_Bundesliga, "home_football_Bundesliga");
      } else if (leagueValue === "football-1" && sportValue === "football") {
        getHomeTeam(
          Leagues.football_Premierleague,
          "home_football_Premierleague"
        );
      } else if (leagueValue === "football-2" && sportValue === "football") {
        getHomeTeam(Leagues.football_SeriaA, "home_football_SeriaA");
      } else if (leagueValue === "football-3" && sportValue === "football") {
        getHomeTeam(Leagues.football_LaLiga, "home_football_LaLiga");
      } else if (leagueValue === "football-4" && sportValue === "football") {
        getHomeTeam(Leagues.football_LigueUne, "home_football_LigueUne");
      } else if (
        leagueValue === "basketball-0" &&
        sportValue === "basketball"
      ) {
        getHomeTeam(Leagues.basketball_France, "home_basketball_France");
      } else if (
        leagueValue === "basketball-1" &&
        sportValue === "basketball"
      ) {
        getHomeTeam(Leagues.basketball_German, "home_basketball_German");
      } else if (
        leagueValue === "basketball-2" &&
        sportValue === "basketball"
      ) {
        getHomeTeam(Leagues.basketball_Spanish, "home_basketball_Spanish");
      } else if (
        leagueValue === "basketball-3" &&
        sportValue === "basketball"
      ) {
        getHomeTeam(Leagues.basketball_NBA, "home_basketball_NBA");
      } else if (
        leagueValue === "basketball-4" &&
        sportValue === "basketball"
      ) {
        getHomeTeam(Leagues.basketball_NCAA, "home_basketball_NCAA");
      }

      chooseDisabled(DOMstrings.inputAway);
    },

    changedHomeType: function () {
      var leagueValue, sportValue, homeValue, awayValue;

      leagueValue = document.querySelector(DOMstrings.inputLeague).value;
      sportValue = document.querySelector(DOMstrings.inputSport).value;
      homeValue = document.querySelector(DOMstrings.inputHome).value;
      awayValue = document.querySelector(DOMstrings.inputAway).value;

      if (leagueValue === "football-0" && sportValue === "football") {
        getAwayTeam(Leagues.football_Bundesliga, "away_football_Bundesliga");
      } else if (leagueValue === "football-1" && sportValue === "football") {
        getAwayTeam(
          Leagues.football_Premierleague,
          "away_football_Premierleague"
        );
      } else if (leagueValue === "football-2" && sportValue === "football") {
        getAwayTeam(Leagues.football_SeriaA, "away_football_SeriaA");
      } else if (leagueValue === "football-3" && sportValue === "football") {
        getAwayTeam(Leagues.football_LaLiga, "away_football_LaLiga");
      } else if (leagueValue === "football-4" && sportValue === "football") {
        getAwayTeam(Leagues.football_LigueUne, "away_football_LigueUne");
      } else if (
        leagueValue === "basketball-0" &&
        sportValue === "basketball"
      ) {
        getAwayTeam(Leagues.basketball_France, "away_basketball_France");
      } else if (
        leagueValue === "basketball-1" &&
        sportValue === "basketball"
      ) {
        getAwayTeam(Leagues.basketball_German, "away_basketball_German");
      } else if (
        leagueValue === "basketball-2" &&
        sportValue === "basketball"
      ) {
        getAwayTeam(Leagues.basketball_Spanish, "away_basketball_Spanish");
      } else if (
        leagueValue === "basketball-3" &&
        sportValue === "basketball"
      ) {
        getAwayTeam(Leagues.basketball_NBA, "away_basketball_NBA");
      } else if (
        leagueValue === "basketball-4" &&
        sportValue === "basketball"
      ) {
        getAwayTeam(Leagues.basketball_NCAA, "away_basketball_NCAA");
      }
    },

    selectChanged: function () {
      var sport = document.querySelector(".add_sport").value;
      document.querySelector(".add_league").disabled = sport == 1;

      var league = document.querySelector(".add_league").value;
      document.querySelector(".add_home_team").disabled = league == 1;

      var home = document.querySelector(".add_home_team").value;
      document.querySelector(".add_away_team").disabled = home == 1;
    },

    addListItem: function (obj) {
      var sport = document.querySelector(".add_sport");
      var league = document.querySelector(".add_league");
      var home = document.querySelector(".add_home_team");
      var away = document.querySelector(".add_away_team");

      var html, newHtml, element, sporttext, leaguetext, hometext, awaytext;

      sporttext = sport.options[sport.selectedIndex].text;
      leaguetext = league.options[league.selectedIndex].text;
      hometext = home.options[home.selectedIndex].text;
      awaytext = away.options[away.selectedIndex].text;

      element = DOMstrings.betList;

      formatedBalance = balanceFormat(obj.gameBalance);

      if (obj.potd === "no") {
        html =
          '<div class="item clearfix" id="bet-%id%"><div class="sport" style="margin-left: 80px ">%sport%</div><div class="league">%league%</div><div class="home_team">%home%</div><div class="away_team">%away%</div><div class="bet_tip">%tip%</div><div class="odds">%odds%x</div><div class="stake">%stake% €</div><div class="game_results">%results%</div><div class="right clearfix"><div class="item_results-%rid%">%balance%</div><div class="item_delete"><button class="item_delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        newHtml = html.replace("%id%", obj.id);
        newHtml = newHtml.replace("%sport%", sporttext);
        newHtml = newHtml.replace("%balance%", formatedBalance);
        newHtml = newHtml.replace("%league%", leaguetext);
        newHtml = newHtml.replace("%home%", hometext);
        newHtml = newHtml.replace("%away%", awaytext);
        newHtml = newHtml.replace("%tip%", obj.tip);
        newHtml = newHtml.replace("%odds%", formatNumberOnlyDecimal(obj.odds));
        newHtml = newHtml.replace(
          "%stake%",
          formatNumberOnlyDecimal(obj.stake)
        );
        newHtml = newHtml.replace("%results%", resultsHelper(obj.results));
        newHtml = newHtml.replace("%rid%", obj.id);
      } else {
        html =
          '<div class="item clearfix" id="bet-%id%"><div class="potd_question">%potd%</div><div class="sport">%sport%</div><div class="league">%league%</div><div class="home_team">%home%</div><div class="away_team">%away%</div><div class="bet_tip">%tip%</div><div class="odds">%odds%x</div><div class="stake">%stake% €</div><div class="game_results">%results%</div><div class="right clearfix"><div class="item_results-%rid%">%balance%</div><div class="item_delete"><button class="item_delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        newHtml = html.replace("%id%", obj.id);
        newHtml = newHtml.replace("%potd%", obj.potd);
        newHtml = newHtml.replace("%sport%", sporttext);
        newHtml = newHtml.replace("%balance%", formatedBalance);
        newHtml = newHtml.replace("%league%", leaguetext);
        newHtml = newHtml.replace("%home%", hometext);
        newHtml = newHtml.replace("%away%", awaytext);
        newHtml = newHtml.replace("%tip%", obj.tip);
        newHtml = newHtml.replace("%odds%", formatNumberOnlyDecimal(obj.odds));
        newHtml = newHtml.replace(
          "%stake%",
          formatNumberOnlyDecimal(obj.stake)
        );
        newHtml = newHtml.replace("%results%", resultsHelper(obj.results));
        newHtml = newHtml.replace("%rid%", obj.id);
      }

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      chooseSelected(DOMstrings.inputPOTD);
      chooseSelected(DOMstrings.inputSport);
      chooseDisabled(DOMstrings.inputLeague);
      chooseDisabled(DOMstrings.inputHome);
      chooseDisabled(DOMstrings.inputAway);

      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputTip +
          ", " +
          DOMstrings.inputOdds +
          "," +
          DOMstrings.inputStake +
          "," +
          DOMstrings.inputResults
      );

      var fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
    },

    getInput: function () {
      return {
        ipotd: document.querySelector(DOMstrings.inputPOTD).value,
        isport: document.querySelector(DOMstrings.inputSport).value,
        ileague: document.querySelector(DOMstrings.inputLeague).value,
        ihome: document.querySelector(DOMstrings.inputHome).value,
        iaway: document.querySelector(DOMstrings.inputAway).value,
        itip: document.querySelector(DOMstrings.inputTip).value,
        iodds: parseFloat(document.querySelector(DOMstrings.inputOdds).value),
        istake: parseFloat(document.querySelector(DOMstrings.inputStake).value),
        iresults: document.querySelector(DOMstrings.inputResults).value,
        ihome_index: document.querySelector(DOMstrings.inputHome).selectedIndex,
        iaway_index: document.querySelector(DOMstrings.inputAway).selectedIndex,
      };
    },

    displayBudget: function (obj) {
      document.querySelector(DOMstrings.picksLabel).textContent = obj.picks;

      if (obj.averagestake > 0) {
        document.querySelector(DOMstrings.averagestakeLabel).textContent =
          formatNumberOnlyDecimal(obj.averagestake) + " €";
      } else {
        document.querySelector(DOMstrings.averagestakeLabel).textContent =
          "0.00 €";
      }

      if (obj.plus > 0) {
        document.querySelector(DOMstrings.incomeLabel).textContent =
          "+" + formatNumber(obj.plus) + " €";
      } else {
        document.querySelector(DOMstrings.incomeLabel).textContent =
          formatNumber(obj.plus) + " €";
      }

      document.querySelector(DOMstrings.budgetnowLabel).textContent =
        formatNumber(obj.budgetnow) + " €";

      document.querySelector(DOMstrings.winsLabel).textContent = obj.wins;

      if (obj.averageodds > 0) {
        document.querySelector(DOMstrings.averageoddsLabel).textContent =
          formatNumberOnlyDecimal(obj.averageodds) + "x";
      } else {
        document.querySelector(DOMstrings.averageoddsLabel).textContent =
          "0.00x";
      }

      if (obj.minus < 0) {
        document.querySelector(DOMstrings.lossLabel).textContent =
          "-" + formatNumber(obj.minus) + " €";
      } else {
        document.querySelector(DOMstrings.lossLabel).textContent =
          formatNumber(obj.minus) + " €";
      }

      if (obj.bankgrowth > 0) {
        document.querySelector(DOMstrings.bankgrowthLabel).textContent =
          "+" + formatNumberOnlyDecimal(obj.bankgrowth) + " %";
      } else if (obj.bankgrowth <= 0) {
        document.querySelector(DOMstrings.bankgrowthLabel).textContent =
          formatNumberOnlyDecimal(obj.bankgrowth) + " %";
      } else {
        document.querySelector(DOMstrings.bankgrowthLabel).textContent =
          "0.00 %";
      }

      if (obj.winpercentage > 0) {
        document.querySelector(DOMstrings.winpercentageLabel).textContent =
          formatNumberOnlyDecimal(obj.winpercentage) + " %";
      } else {
        document.querySelector(DOMstrings.winpercentageLabel).textContent =
          "0.00 %";
      }

      if (obj.roi > 0) {
        document.querySelector(DOMstrings.roiLabel).textContent =
          "+" + formatNumberOnlyDecimal(obj.roi) + " %";
      } else if (obj.roi <= 0) {
        document.querySelector(DOMstrings.roiLabel).textContent =
          formatNumberOnlyDecimal(obj.roi) + " %";
      } else {
        document.querySelector(DOMstrings.roiLabel).textContent = "0.00 %";
      }

      if (obj.budget > 0) {
        document.querySelector(DOMstrings.budgetLabel).textContent =
          "+" + formatNumber(obj.budget) + " €";
      } else if (obj.budget < 0) {
        document.querySelector(DOMstrings.budgetLabel).textContent =
          "-" + formatNumber(obj.budget) + " €";
      } else {
        document.querySelector(DOMstrings.budgetLabel).textContent =
          formatNumber(obj.budget) + " €";
      }
    },
  };
})();

var controller = (function (BudgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(DOM.inputSport)
      .addEventListener("change", UICtrl.changedSportType);
    document
      .querySelector(DOM.inputLeague)
      .addEventListener("change", UICtrl.changedLeagueType);
    document
      .querySelector(DOM.inputHome)
      .addEventListener("change", UICtrl.changedHomeType);
  };

  var updateBudget = function () {
    // 1. Calculate the budget
    BudgetCtrl.calculateBudget();

    // 2. return the budget
    var budget = BudgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);

    // 4. Change Color
    BudgetCtrl.displayTableColor();
  };

  var ctrlAddItem = function () {
    var input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();

    if (
      input.ipotd != 1 &&
      input.ileague != 1 &&
      input.ihome != 1 &&
      input.iaway != 1 &&
      input.iaway_index !== input.ihome_index &&
      input.itip != "" &&
      !isNaN(input.iodds) &&
      !isNaN(input.istake) &&
      input.istake > 0 &&
      input.iodds > 1 &&
      (input.iresults === "W" ||
        input.iresults === "L" ||
        input.iresults === "P")
    ) {
      // 2. Add the item to the budget controller
      newItem = BudgetCtrl.addItem(
        input.ipotd,
        input.isport,
        input.ileague,
        input.ihome,
        input.iaway,
        input.itip,
        input.iodds,
        input.istake,
        input.iresults
      );

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem);
      BudgetCtrl.colorRes(newItem.id);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5- Calculate and updates budget
      updateBudget();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete the item from data structure
      BudgetCtrl.deleteItem(ID);

      // 2. delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. update the show the new budget
      updateBudget();
    }
  };

  return {
    init: function () {
      UICtrl.displayBudget({
        picks: 0,
        averagestake: 0,
        plus: 0,
        averageodds: 0,
        wins: 0,
        minus: 0,
        bankgrowth: 0,
        winpercentage: 0,
        budget: 0,
        roi: 0,
      });
      UICtrl.selectChanged();
      BudgetCtrl.promptStartingBank();
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
