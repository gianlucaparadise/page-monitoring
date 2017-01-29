create table pageMonitors (
    id bigserial PRIMARY KEY,
	url text NOT NULL,
	idUtente varchar(40) NOT NULL,
	descrizioneUtente varchar(100),
	idChat varchar(40) NOT NULL,
	idStato integer NOT NULL,
	htmlPrecedente TEXT,
	numeroCambiamentiHtml integer,
	dataUltimoControllo timestamp,
	dataInserimentoRichiesta timestamp
);