/**
* Auteur : 	DWAPS Formation - Michael Cornillon
* Client :	Philippe PIATTI
* Mail : 	contact@dwaps.fr
* Tel :		0651279211
* Site : 	http://dwaps.fr
* Date : 	19/02/2017
**/


document.addEventListener(
	'DOMContentLoaded',
	function()
	{
		var dwaps = new DWAPS();

		dwaps.init();
		dwaps.initZoom();
	}
);


// Objet DWAPS

var DWAPS = function() {};
DWAPS.prototype = {
	// PARAMETRAGE
	options:
	{
		UNITE: "px",
		DOSSIER_VENDORS: "lib",

		// ZOOM
		ID_BLOC_BOUTONS_ZOOM: "bloc-boutons-zoom",
		BTS_ZOOM_COLOR: "btn-success", /* Couleurs bootstrap */
	    TAILLE_POLICE: 15,
	    TAILLE_POLICE_MAX: 20,
	    TAILLE_POLICE_MIN: 10,
	    ECART_ENTRE_BOUTONS: 10
	},

	init: function()
	{
		var link = document.createElement('link');
			link.rel = "stylesheet";
			link.href = this.options.DOSSIER_VENDORS + "/bootstrap/dist/css/bootstrap.min.css";

		document.head.appendChild(link);
	},

	initZoom: function()
	{
		// RECUPERATION DE LA BALISE POUR LE ZOOM (<dwaps-zoom></dwaps-zoom>)
		// ET CONSTRUCTION DES ELEMENTS (boutons...)
		var blocZoom = document.querySelector('dwaps-zoom');
			blocZoom.id = this.options.ID_BLOC_BOUTONS_ZOOM;
			blocZoom.className = "container";


		// Gestion affichage via bootstrap
		// Création ligne et colonnes de chaque bouton
		var row = document.createElement('div');
		var	col = row.cloneNode();
		row.className = "row";
		col.className = "col-xs-1 text-center";

		
		// Création bt moins
		this.btPlus = document.createElement('link');
		this.btPlus.className = "btn " + this.options.BTS_ZOOM_COLOR + " glyphicon";
		this.btPlus.href = "#";

		// Création bt moins
		this.btMoins = this.btPlus.cloneNode();

		// Paramétrage des boutons
		this.btPlus.id += "zoomer";
		this.btMoins.id += "dezoomer";
		this.btPlus.className += " glyphicon-plus";
		this.btMoins.className += " glyphicon-minus";

		// Construction DOM
		col.appendChild(this.btPlus);
		col.appendChild(this.btMoins);
		row.appendChild(col);
		blocZoom.appendChild(row);

		// Capture texte à zoomer/dézoomer
		this.textToZoom = document.querySelector('.zoomable');
		this.textToZoom.style.fontSize = this.options.TAILLE_POLICE + this.options.UNITE;

		// Gestion du clic des boutons
		var THIS = this;

		this.btPlus
			.addEventListener(
				'click',
				function()
				{
					THIS.zoom(true);
				}
		);
		this.btMoins
			.addEventListener(
				'click',
				function()
				{
					THIS.zoom(false);
				}
		);
	},

	zoom: function(zoomPlus)
	{
		this.options.TAILLE_POLICE = zoomPlus ? 
									this.options.TAILLE_POLICE+1 :
									this.options.TAILLE_POLICE-1;


		if(this.options.TAILLE_POLICE >= this.options.TAILLE_POLICE_MAX)
		{
			this.options.TAILLE_POLICE = this.options.TAILLE_POLICE_MAX;
		}
		else if(this.options.TAILLE_POLICE <= this.options.TAILLE_POLICE_MIN)
		{
			this.options.TAILLE_POLICE = this.options.TAILLE_POLICE_MIN;
		}


		this.textToZoom.style.fontSize = this.options.TAILLE_POLICE + this.options.UNITE;
	}
};