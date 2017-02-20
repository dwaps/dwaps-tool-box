/**
* Auteur : 	DWAPS Formation - Michael Cornillon
* Client :	Philippe PIATTI
* Mail : 	contact@dwaps.fr
* Tel :		0651279211
* Site : 	http://dwaps.fr
* Date : 	19/02/2017
**/

/**
 * -----------------
 *   DOCUMENTATION
 * -----------------
 * 
 * FONCTION ZOOM :
 * 1/ Insérer script dwaps-tool-box/main.js dans page html
 * 2/ Insérer balise <dwaps-zoom></dwaps-zoom> à l'emplacement souhaité pour les boutons de zoom
 * 3/ Appliquer la classe .zoomable au texte cible
 */


document.addEventListener(
	'DOMContentLoaded',
	function()
	{
		var dwaps = new DWAPS();

		dwaps.init();
		dwaps.initZoom();
	}
);



// Fonction de détection du dossier racine de dwaps-tool-box
function captureVendorsFolder()
{
	var allScripts = document.querySelectorAll('script'), folder;

	allScripts.forEach(
		function(s)
		{
			if(s.src.match("dwaps-tool-box"))
				folder = s.src.replace("/main.js", "");
		}
	);

	return folder;
}

// Fonction de récupération de la taille de police sauvegardée
function getFontSizeSaved()
{
	var fontSize = 18;

	if(localStorage)
	{
		var fs = localStorage.getItem('dwaps-fontSize');
		if(fs) fontSize = fs;
	}

	return fontSize;
}


// Objet DWAPS

var DWAPS = function() {};

DWAPS.prototype = {

	// PARAMETRAGE
	options:
	{
		UNITE: "px",
		RACINE_DWAPS_TOOL_BOX: captureVendorsFolder(),

		// ZOOM
		ID_BLOC_BOUTONS_ZOOM: "bloc-boutons-zoom",
		BTS_ZOOM_COLOR: "btn-success", /* Couleurs bootstrap */
	    TAILLE_POLICE: getFontSizeSaved(),
	    TAILLE_POLICE_MAX: 30,
	    TAILLE_POLICE_MIN: 10,
	    ECART_ENTRE_BOUTONS: 10,
	    POS_COL_BTS: "col-xs-offset-4 col-xs-4",
	    ICON_BT_PLUS: "glyphicon-plus",
	    ICON_BT_MOINS: "glyphicon-minus",

	    // MESSAGES INFORMATIFS
	    ALERT: "Désolé, la fonctionnalité pour le stockage ne fonctionne pas !",
	    TIME_ALERT: 2000,
	    DEV_MAIL: "contact@dwaps.fr" // Placez votre mail ici !
	},

	init: function()
	{
		var link = document.querySelector('bootstrap-css');

		if(!link)
		{
			var link = document.createElement('link');
				link.id = "bootstrap-css";
				link.rel = "stylesheet";
				link.href = this.options.RACINE_DWAPS_TOOL_BOX + "/lib/bootstrap/dist/css/bootstrap.min.css";

			document.head.appendChild(link);
		}
	},

	initZoom: function()
	{
		// RECUPERATION DE LA BALISE POUR LE ZOOM (<dwaps-zoom></dwaps-zoom>)
		// ET CONSTRUCTION DES ELEMENTS (boutons...)
		var blocZoom = document.querySelector('dwaps-zoom');

		if(blocZoom)
		{
			blocZoom.id = this.options.ID_BLOC_BOUTONS_ZOOM;
			blocZoom.className = "container";


			// Gestion affichage via bootstrap
			// Création ligne et colonnes de chaque bouton
			var row = document.createElement('div');
			var	col = row.cloneNode();
			row.className = "row";
			col.className = this.options.POS_COL_BTS + " text-center";

			
			// Création bt moins
			this.btPlus = document.createElement('link');
			this.btPlus.className = "btn " + this.options.BTS_ZOOM_COLOR + " glyphicon ";
			this.btPlus.href = "#";
			this.btPlus.style.marginRight = this.options.ECART_ENTRE_BOUTONS + this.options.UNITE;

			// Création bt moins
			this.btMoins = this.btPlus.cloneNode();

			// Paramétrage des boutons
			this.btPlus.className += this.options.ICON_BT_PLUS;
			this.btMoins.className += this.options.ICON_BT_MOINS;

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
		}
		else
		{
			if(localStorage)
			{
				if(localStorage.getItem('dwaps-fontSize') > 0)
					localStorage.removeItem('dwaps-fontSize');
			}
		}
	},

	zoom: function(zoomPlus)
	{
		this.options.TAILLE_POLICE = zoomPlus ? 
									parseInt(this.options.TAILLE_POLICE)+1 :
									parseInt(this.options.TAILLE_POLICE)-1;


		if(this.options.TAILLE_POLICE >= this.options.TAILLE_POLICE_MAX)
		{
			this.options.TAILLE_POLICE = this.options.TAILLE_POLICE_MAX;
		}
		else if(this.options.TAILLE_POLICE <= this.options.TAILLE_POLICE_MIN)
		{
			this.options.TAILLE_POLICE = this.options.TAILLE_POLICE_MIN;
		}


		this.textToZoom.style.fontSize = this.options.TAILLE_POLICE + this.options.UNITE;

		this.saveZoomLevel();
	},

	saveZoomLevel: function()
	{
		if(localStorage)
		{
			localStorage.setItem("dwaps-fontSize", this.options.TAILLE_POLICE);
		}
		else
		{
			var alert = document.querySelector('#alert');

			if(!alert)
			{
				var alert = document.createElement('div');
					alert.id = "alert";
					alert.className = "text-center";
					alert.innerHTML = '<h4>' + this.options.ALERT + '</h4><p><a style="color:red" href="mailto:' + this.options.DEV_MAIL + '">Contactez le développeur</a></p>';
					alert.setAttribute('style', '\
						position: absolute;\
						top: 0;\
						bottom: 0;\
						left: 0;\
						right: 0;\
						padding-top: 90px;\
						background: black;\
						color: white;\
						font-weight: bold;\
						');
				document.body.appendChild(alert);
			}

			alert.style.display = "block";

			setTimeout(
				function()
				{
					alert.style.display = "none";
				},
				this.options.TIME_ALERT
			);

		}
	}
};