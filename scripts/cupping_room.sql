--
-- PostgreSQL database dump
--

\restrict JzfRzNgytOcv0LzZcFNXHeEpRAI9wMToYk6Qt7jZCrNhmVicHrhCChu6A7Wlxyo

-- Dumped from database version 17.5 (6bc9ef8)
-- Dumped by pg_dump version 17.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Event" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone,
    location text,
    price double precision DEFAULT 0,
    "createdBy" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Event_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Event_id_seq" OWNED BY public."Event".id;


--
-- Name: Signup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Signup" (
    id integer NOT NULL,
    "eventId" integer NOT NULL,
    "userEmail" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Signup_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Signup_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Signup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Signup_id_seq" OWNED BY public."Signup".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name text
);


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: Event id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Event" ALTER COLUMN id SET DEFAULT nextval('public."Event_id_seq"'::regclass);


--
-- Name: Signup id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Signup" ALTER COLUMN id SET DEFAULT nextval('public."Signup_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Event" (id, title, description, "startTime", "endTime", location, price, "createdBy", "createdAt") FROM stdin;
14	13th BIRTHDAY CUPPING CLUB	Hosted by: Campbell & syme x Cofinet x MiCafe	2025-10-22 15:30:00	2025-10-22 19:30:00	Campbell and Syme 9 Fortis Green, London, N2 9JR	0	12	2025-10-17 16:12:43.028
17	Free roasting workshop with Rubasse	Hosted by: Bay coffee roasters x Rubasse Roasters	2025-10-30 14:00:00	2025-10-30 17:00:00	Independent Coffee Lab 63 Union Street, London, SE1 1SG	0	12	2025-10-17 16:17:30.925
15	Barista Hub	Hosted by: Sanremo	2025-10-23 16:00:00	2025-10-23 19:00:00	Sanremo 6/7 Thurloe Place, London, SW7 2RX	0	12	2025-10-17 16:14:46.337
16	Cupping	Hosted by: Kaffeine x Square Mile	2025-10-23 16:30:00	2025-10-23 18:00:00	Kaffeine 15 Eastcastle Street, London, W1T 3AY	11.55	12	2025-10-17 16:15:58.078
18	Coffee cocktail evening	Hosted by: Sanremo	2025-10-30 18:00:00	2025-10-30 22:00:00	Sanremo 6/7 Thurloe Place, London, SW7 2RX	0	12	2025-10-17 16:19:05.698
\.


--
-- Data for Name: Signup; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Signup" (id, "eventId", "userEmail", "createdAt") FROM stdin;
39	14	staff@cuppingroom.com	2025-10-17 16:19:46.907
40	16	staff@cuppingroom.com	2025-10-17 16:19:50.438
41	17	staff@cuppingroom.com	2025-10-17 16:20:07.059
42	14	user@cuppingroom.com	2025-10-17 16:20:53.958
43	15	user@cuppingroom.com	2025-10-17 16:21:03.227
44	17	user@cuppingroom.com	2025-10-17 16:21:08.73
45	18	user@cuppingroom.com	2025-10-17 16:21:10.455
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, password, role, "createdAt", name) FROM stdin;
11	user@cuppingroom.com	$2b$10$l8W39xwTMtkgaC30RY95F.vdBvJNW5hw5mcZ4nOdBjqESw3S90ZsW	user	2025-10-17 16:09:27.883	John Smith
12	staff@cuppingroom.com	$2b$10$HAPFpsQps2Y5AVqOV/F4vu3X1md62eeN4Hlu6JheZ3ktXTUtKbfXC	staff	2025-10-17 16:10:04.015	Jane Doe
13	test@cuppingroom.com	$2b$10$PswdKaueD1pJqvgAPIyGmuHfGN.xRpmz3rW5no8o2NXMJ7sMdO6TW	staff	2025-10-17 17:30:18.988	Test User
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2be9b628-761c-4338-ab20-37fe1a1cb8c1	b8dd8ede49316d1021879e0b83abdd098cc5ff95e1470386a722f05038ce11e7	2025-10-10 15:26:32.244266+00	20251010152632_init	\N	\N	2025-10-10 15:26:32.187461+00	1
0f21c7c2-b7d1-44c6-acb4-93c06a414179	2b7990c04970630765c979573e34b6cb9b21f211e3a1a6c37d2cd824bf928011	2025-10-14 16:06:05.68112+00	20251014160605_cascade_delete_signups	\N	\N	2025-10-14 16:06:05.626933+00	1
527a77f6-64f4-4829-bc28-560b9daf7e98	1ccb48a60fb11c9478bfbee052888551324325ecbb63d6acac28b068efe5bc9e	2025-10-14 19:04:20.685699+00	20251014190420_add_name_to_user	\N	\N	2025-10-14 19:04:20.646338+00	1
a763200f-5838-41bc-a691-ddaf7cce9fb0	7ee27dbef2f8aaf4c2088f794d8149d6058ac79c93f7b5b9bea1e896aa3e9731	2025-10-14 21:31:19.41951+00	20251014213119_	\N	\N	2025-10-14 21:31:19.367668+00	1
c9c78416-2a14-4972-ad35-51de2b8018f4	bccc00d51eb802dad9d015f9f1ed80c387dd01fca12f946ed096ca03dd73dd2c	2025-10-15 15:34:16.858057+00	20251015153416_unique_event_signup	\N	\N	2025-10-15 15:34:16.808555+00	1
06b74671-c8d6-4c51-b5aa-cb646a6f2302	7000a60c7afa8f625552688b856a41a00fd313c3be0aeccbaf708a85b99c66ea	2025-10-15 17:48:30.725583+00	20251015174830_add_user_to_signup	\N	\N	2025-10-15 17:48:30.67074+00	1
\.


--
-- Name: Event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Event_id_seq"', 18, true);


--
-- Name: Signup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Signup_id_seq"', 45, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."User_id_seq"', 13, true);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Signup Signup_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Signup"
    ADD CONSTRAINT "Signup_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Signup_eventId_userEmail_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Signup_eventId_userEmail_key" ON public."Signup" USING btree ("eventId", "userEmail");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Event Event_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Signup Signup_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Signup"
    ADD CONSTRAINT "Signup_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Signup Signup_userEmail_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Signup"
    ADD CONSTRAINT "Signup_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES public."User"(email) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict JzfRzNgytOcv0LzZcFNXHeEpRAI9wMToYk6Qt7jZCrNhmVicHrhCChu6A7Wlxyo

