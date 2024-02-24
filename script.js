let transakce = [
  { amount: 500, category: 'Plat', type: 'Příjem' },
  { amount: 50, category: 'Potraviny', type: 'výdaj' },
];

function showLoginModal() {
  document.getElementById('prihlaseni').style.display = 'block';
}

function prihlasit() {
  const username = document.getElementById('jmeno').value;
  const password = document.getElementById('heslo').value;

  console.log('Přihlašovací údaje:');
  console.log('Uživatelské jméno:', username);
  console.log('Heslo:', password);

  document.getElementById('prihlaseni').style.display = 'none';
}

function pridattransakci() {
  const amount = parseFloat(document.getElementById('castka').value);
  const category = document.getElementById('kategorie').value;
  const type = document.getElementById('tipy').value;

  transakce.push({ amount, category, type });

  novyzustatek();
  nacisttransakci();
}

function nacisttransakci() {
  const transakcekontejner = document.getElementById('transakce');
  transakcekontejner.innerHTML = '';

  transakce.forEach(transakci => {
      const transakcehodnota = document.createElement('div');
      transakcehodnota.classList.add('transakci');
      transakcehodnota.innerHTML = `<strong>${transakci.category}:</strong> ${transakci.amount} (${transakci.type})`;
      transakcekontejner.appendChild(transakcehodnota);
  });

  nacistfiltrkategirie();
}

function nacistfiltrkategirie() {
  const filtrkategorie = document.getElementById('filtr-kategorie');
  const kategorie = [...new Set(transakce.map(transaction => transaction.category))];

  filtrkategorie.innerHTML = '<option value="">Všechny Kategorie</option>';

  kategorie.forEach(category => {
      const moznosti = document.createElement('option');
      moznosti.value = category;
      moznosti.textContent = category;
      filtrkategorie.appendChild(moznosti);
  });

  filtrtransakce();
}

function filtrtransakce() {
  const filterkategorie = document.getElementById('filtr-kategorie').value;
  const filterceny = parseFloat(document.getElementById('filtrovat-castku').value) || 0;

  const filtrovanytransakce = transakce.filter(transaction =>
      (!filterkategorie || transaction.category === filterkategorie) &&
      (!filterceny || transaction.amount === filterceny)
  );

  vypistransakce(filtrovanytransakce);
}

function vypistransakce(filtrovanytransakce) {
  const kontejnertransakce = document.getElementById('transakce');
  kontejnertransakce.innerHTML = '';

  filtrovanytransakce.forEach(transakce => {
      const transakcihodnota = document.createElement('div');
      transakcihodnota.classList.add('transaction');
      transakcihodnota.innerHTML = `<strong>${transakce.category}:</strong> ${transakce.amount} (${transakce.type})`;
      kontejnertransakce.appendChild(transakcihodnota);
  });
}

function novyzustatek() {
  const hodnotazustatku = document.getElementById('zustatek-uctu');
  const zustatek = transakce.reduce((acc, transakce) => {
      return transakce.type === 'Příjem' ? acc + transakce.amount : acc - transakce.amount;
  }, 0);

  hodnotazustatku.textContent = zustatek;
}
function CenaDPH() {
  const bezdph = document.getElementById('cenaBezDPH');
  const sazbadph = document.getElementById('sazbaDPH');
  const celkovacena = document.getElementById('celkovaCena');
  const rozdilcelkem = document.getElementById('rozdil');

  const cenabezdph = parseFloat(bezdph.value);
  const sazbaDPH = parseFloat(sazbadph.value);

  if (!isNaN(cenabezdph) && !isNaN(sazbaDPH)) {
    const cenaSDPH = cenabezdph * (1 + sazbaDPH);
    const rozdil = cenaSDPH - cenabezdph;

    celkovacena.innerText = 'Celková cena s DPH: ' + cenaSDPH + ' Kč';
    rozdilcelkem.innerText = 'Rozdíl: ' + rozdil.toFixed(2) + ' Kč';
  } else {
    alert('Zadejte platné hodnoty pro cenu bez DPH a sazbu DPH.');
  }
}
function prevodMeny() {
  const zakladnimena = document.getElementById('zakladniMena');
  const konecnamena = document.getElementById('cilovaMena');
  const prevod = document.getElementById('castkaKPrevodu');
  const prevedeno = document.getElementById('prevedenaCastka');

  const zakladniMena = zakladnimena.value;
  const cilovaMena = konecnamena.value;
  const castkakprevodu = parseFloat(prevod.value);

  const kurzEUnaCZ = 25.31;
  const kurzCZKnaEUR = 0.040;

  if (!isNaN(castkakprevodu)) {
    if (zakladniMena === "EUR" && cilovaMena === "CZK") {
      const prevedenaCastka = castkakprevodu * kurzEUnaCZ;
      prevedeno.innerText = 'Převedená částka: ' + prevedenaCastka.toFixed(2) + ' ' + cilovaMena;
    } else if (zakladniMena === "CZK" && cilovaMena === "EUR") {
      const prevedenaCastka = castkakprevodu * kurzCZKnaEUR;
      prevedeno.innerText = 'Převedená částka: ' + prevedenaCastka.toFixed(2) + ' ' + cilovaMena;
    }
  }  
}

function Investicikalkulacka() {
  const formularPrvky = {
    'pocatecniCastka': 'Počáteční částka',
    'mesicniVklad': 'Měsíční vklad',
    'urokovaSazba': 'Roční úroková sazba',
    'dobaTrvani': 'Doba trvání spoření/investice'
  };

  const hodnoty = {};

  for (const prvek in formularPrvky) {
    const element = document.getElementById(prvek);
    hodnoty[prvek] = parseFloat(element.value);

    if (isNaN(hodnoty[prvek])) {
      alert(`Zadejte platnou hodnotu pro ${formularPrvky[prvek]}.`);
      return;
    }
  }

  const budouciHodnotaElement = document.getElementById('budouciHodnota');

  const mesicniUrokovaSazba = hodnoty['urokovaSazba'] / 100 / 12; 
  const pocetPlatby = hodnoty['dobaTrvani'] * 12;

  const budouciHodnota =
    hodnoty['pocatecniCastka'] * Math.pow(1 + mesicniUrokovaSazba, pocetPlatby) +
    hodnoty['mesicniVklad'] * ((Math.pow(1 + mesicniUrokovaSazba, pocetPlatby) - 1) / mesicniUrokovaSazba);

  budouciHodnotaElement.innerText = 'Budoucí hodnota spoření/investice: ' + budouciHodnota.toFixed(2) + ' Kč';
}

nacisttransakci();
novyzustatek();