import { CalendarEvent } from '../types';

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-expo-ambiente-2026',
    title: 'EXPO AMBIENTE 2026',
    organizer: 'Secretaría de Medio Ambiente y Desarrollo Sustentable',
    location: 'Instalaciones del CEARTE (Centro Estatal de las Artes)',
    date: '2026-09-24',
    startTime: '09:00',
    endTime: '13:00',
    description: 'En esta ocasión el tema está enfocado en la reducción de residuos, particularmente aquellos derivados del uso de plásticos de un solo uso. Presentación de iniciativas sustentables y mesas de diálogo.',
    category: 'Ambiental',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 5,
      actualAttendees: undefined,
      delegationNames: ['Comitiva Institucional de Vinculación'],
      notes: 'Llevar material informativo institucional y folletos digitales con código QR para reducir uso de papel.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#10b981',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'evt-expo-uabc-tijuana-2026-dia1',
    title: 'Expo UABC Campus Tijuana - Día 1',
    organizer: 'UABC - Universidad Autónoma de Baja California',
    location: 'UABC Campus Tijuana',
    date: '2026-10-13',
    startTime: '08:00',
    endTime: '13:00',
    description: 'Participación en Expo UABC Campus Tijuana (Día 1). Módulo de vinculación y plática institucional programada de 8:00 a 13:00 h.',
    category: 'Académico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 4,
      actualAttendees: undefined,
      delegationNames: ['Comitiva de Expositores y Atención en Módulo'],
      notes: 'Módulo y plática institucional para ambos días.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#6366f1',
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'evt-expo-uabc-tijuana-2026-dia2',
    title: 'Expo UABC Campus Tijuana - Día 2',
    organizer: 'UABC - Universidad Autónoma de Baja California',
    location: 'UABC Campus Tijuana',
    date: '2026-10-14',
    startTime: '08:00',
    endTime: '13:00',
    description: 'Participación en Expo UABC Campus Tijuana (Día 2). Módulo de vinculación y plática institucional programada de 8:00 a 13:00 h.',
    category: 'Académico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 4,
      actualAttendees: undefined,
      delegationNames: ['Comitiva de Expositores y Atención en Módulo'],
      notes: 'Módulo y plática institucional para ambos días.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#6366f1',
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'evt-expo-uabc-ensenada-2026',
    title: 'Expo Profesiones UABC 2026, Campus Ensenada',
    organizer: 'UABC - Universidad Autónoma de Baja California',
    location: 'Unidad Deportiva en Valle Dorado, Ensenada',
    date: '2026-10-28',
    startTime: '09:00',
    endTime: '16:00',
    description: `Por medio del presente, me permito enviarle el oficio de invitación para participar en la Expo Profesiones UABC 2026, Campus Ensenada. El evento está programado para el miércoles 28 de octubre del presente año.

Fecha límite para confirmar asistencia y solicitar mobiliario: lunes 28 de septiembre.

Enlaces oficiales para trámites:
• Confirmación de asistencia: https://forms.gle/Krbt89Gia9GN2u4C6
• Solicitud de mobiliario: https://forms.gle/1pQYVWjPSYRw6dwX8

Requerimiento de montaje: Llevar proyectos o cosas llamativas en el montaje del módulo.`,
    category: 'Académico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 6,
      actualAttendees: undefined,
      delegationNames: ['Equipo de Vinculación y Proyectos Demostrativos'],
      notes: 'Llevar proyectos o elementos interactivos y llamativos en el montaje del módulo. Confirmación y mobiliario antes del 28 de septiembre.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#0ea5e9',
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T18:50:00Z'
  },
  {
    id: 'evt-limite-registro-expo-ensenada-2026',
    title: 'Fecha Límite: Confirmación y Mobiliario Expo Profesiones UABC Ensenada',
    organizer: 'UABC Campus Ensenada',
    location: 'Trámite en Línea (Google Forms)',
    date: '2026-09-28',
    startTime: '09:00',
    endTime: '18:00',
    description: `Último día para completar los trámites requeridos para la Expo Profesiones UABC 2026, Campus Ensenada:

1. Formulario de Confirmación de asistencia:
https://forms.gle/Krbt89Gia9GN2u4C6

2. Formulario de Solicitud de mobiliario:
https://forms.gle/1pQYVWjPSYRw6dwX8`,
    category: 'Institucional',
    status: 'pendiente',
    attendance: {
      projectedAttendees: 2,
      actualAttendees: undefined,
      delegationNames: ['Responsable de Logística y Vinculación'],
      notes: 'Enviar formularios completos antes del cierre del día lunes 28 de septiembre.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#f59e0b',
    createdAt: '2026-09-15T18:50:00Z',
    updatedAt: '2026-09-15T18:50:00Z'
  },
  {
    id: 'evt-noche-de-ciencias-2026',
    title: 'Noche de Ciencias',
    organizer: 'Facultad de Ciencias Marinas - UABC',
    location: 'Facultad de Ciencias Marinas',
    date: '2026-09-26',
    startTime: '15:00',
    endTime: '21:00',
    description: `Noche de Ciencias en la Facultad de Ciencias Marinas. Presentación de tres actividades:

1. Hidroponía.
2. Peces de ornato y ranas, con un enfoque genético.
3. Alimentación en vida silvestre, también con un enfoque genético.`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 5,
      actualAttendees: undefined,
      delegationNames: ['Equipo de Divulgación Científica y Genética'],
      notes: 'Montaje de 3 módulos de actividades: Hidroponía, Peces de ornato y ranas (genético), y Alimentación en vida silvestre (genético).'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#06b6d4',
    createdAt: '2026-09-21T13:31:00Z',
    updatedAt: '2026-09-21T13:31:00Z'
  },
  {
    id: 'evt-limite-registro-casa-abierta-2026',
    title: 'Fecha Límite: Registro de Proyectos - XIX Casa Abierta de Ciencias Marinas',
    organizer: 'Facultad de Ciencias Marinas - UABC',
    location: 'Trámite en Línea (Google Forms)',
    date: '2026-10-12',
    startTime: '09:00',
    endTime: '18:00',
    description: `Fecha límite para el registro de proyectos para la XIX Casa Abierta de Ciencias Marinas, dentro de la Expo Ciencia y Tecnología 2026.

En el siguiente enlace podrán registrar su proyecto:
https://forms.gle/HjFY5JKRb9xPkWSE8

El evento presencial se llevará a cabo del 21 al 23 de octubre, en un horario de 9:00 a 16:00 horas en la Facultad de Ciencias Marinas.

Agradecemos mucho su entusiasmo y apoyo para que este evento sea nuevamente un espacio de aprendizaje y divulgación que inspire a nuestros visitantes.`,
    category: 'Institucional',
    status: 'pendiente',
    attendance: {
      projectedAttendees: 5,
      actualAttendees: undefined,
      delegationNames: ['Docentes, Investigadores y Estudiantes Expositores'],
      notes: 'Completar registro de proyecto en formulario antes del 12 de octubre de 2026.'
    },
    reminder: {
      enabled: true,
      timing: '2_days',
      notified: false
    },
    badgeColor: '#f59e0b',
    createdAt: '2026-09-28T21:45:00Z',
    updatedAt: '2026-09-28T21:45:00Z'
  },
  {
    id: 'evt-xix-casa-abierta-ciencias-marinas-2026-dia1',
    title: 'XIX Casa Abierta de Ciencias Marinas (Día 1) - Expo Ciencia y Tecnología 2026',
    organizer: 'Facultad de Ciencias Marinas - UABC',
    location: 'Facultad de Ciencias Marinas',
    date: '2026-10-21',
    startTime: '09:00',
    endTime: '16:00',
    description: `Los invitamos a participar en la XIX Casa Abierta de Ciencias Marinas, dentro de la Expo Ciencia y Tecnología 2026, que se llevará a cabo del 21 al 23 de octubre, en un horario de 9:00 a 16:00 horas.

En el siguiente enlace podrán registrar su proyecto:
https://forms.gle/HjFY5JKRb9xPkWSE8

Fecha límite para registro: 12 de octubre de 2026.

Agradecemos mucho su entusiasmo y apoyo para que este evento sea nuevamente un espacio de aprendizaje y divulgación que inspire a nuestros visitantes.`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 15,
      actualAttendees: undefined,
      delegationNames: ['Comunidad Académica, Investigadores y Divulgadores FCM'],
      notes: 'Espacio de aprendizaje y divulgación científica marina. Horario continuo de 9:00 a 16:00 h.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#059669',
    createdAt: '2026-09-28T21:45:00Z',
    updatedAt: '2026-09-28T21:45:00Z'
  },
  {
    id: 'evt-xix-casa-abierta-ciencias-marinas-2026-dia2',
    title: 'XIX Casa Abierta de Ciencias Marinas (Día 2) - Expo Ciencia y Tecnología 2026',
    organizer: 'Facultad de Ciencias Marinas - UABC',
    location: 'Facultad de Ciencias Marinas',
    date: '2026-10-22',
    startTime: '09:00',
    endTime: '16:00',
    description: `Los invitamos a participar en la XIX Casa Abierta de Ciencias Marinas, dentro de la Expo Ciencia y Tecnología 2026, que se llevará a cabo del 21 al 23 de octubre, en un horario de 9:00 a 16:00 horas.

En el siguiente enlace podrán registrar su proyecto:
https://forms.gle/HjFY5JKRb9xPkWSE8

Fecha límite para registro: 12 de octubre de 2026.

Agradecemos mucho su entusiasmo y apoyo para que este evento sea nuevamente un espacio de aprendizaje y divulgación que inspire a nuestros visitantes.`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 15,
      actualAttendees: undefined,
      delegationNames: ['Comunidad Académica, Investigadores y Divulgadores FCM'],
      notes: 'Segundo día de exposiciones y proyectos interactivos de ciencias marinas.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#059669',
    createdAt: '2026-09-28T21:45:00Z',
    updatedAt: '2026-09-28T21:45:00Z'
  },
  {
    id: 'evt-xix-casa-abierta-ciencias-marinas-2026-dia3',
    title: 'XIX Casa Abierta de Ciencias Marinas (Día 3) - Expo Ciencia y Tecnología 2026',
    organizer: 'Facultad de Ciencias Marinas - UABC',
    location: 'Facultad de Ciencias Marinas',
    date: '2026-10-23',
    startTime: '09:00',
    endTime: '16:00',
    description: `Los invitamos a participar en la XIX Casa Abierta de Ciencias Marinas, dentro de la Expo Ciencia y Tecnología 2026, que se llevará a cabo del 21 al 23 de octubre, en un horario de 9:00 a 16:00 horas.

En el siguiente enlace podrán registrar su proyecto:
https://forms.gle/HjFY5JKRb9xPkWSE8

Fecha límite para registro: 12 de octubre de 2026.

Agradecemos mucho su entusiasmo y apoyo para que este evento sea nuevamente un espacio de aprendizaje y divulgación que inspire a nuestros visitantes.`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 15,
      actualAttendees: undefined,
      delegationNames: ['Comunidad Académica, Investigadores y Divulgadores FCM'],
      notes: 'Tercer día y cierre de la XIX Casa Abierta de Ciencias Marinas.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#059669',
    createdAt: '2026-09-28T21:45:00Z',
    updatedAt: '2026-09-28T21:45:00Z'
  },
  {
    id: 'evt-expo-profesiones-mexicali-2026-dia1',
    title: 'ExpoProfesiones Mexicali - Día 1',
    organizer: 'UABC',
    location: 'Mexicali',
    date: '2026-10-21',
    startTime: '08:00',
    endTime: '16:00',
    description: 'Participación en ExpoProfesiones Mexicali (Día 1). Horario: 8:00 a 16:00 h ambos días.',
    category: 'Académico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 4,
      actualAttendees: undefined,
      delegationNames: ['Comitiva de Expositores UABC'],
      notes: 'Atención a aspirantes de preparatoria y bachillerato en Mexicali.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#8b5cf6',
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z'
  },
  {
    id: 'evt-expo-profesiones-mexicali-2026-dia2',
    title: 'ExpoProfesiones Mexicali - Día 2',
    organizer: 'UABC',
    location: 'Mexicali',
    date: '2026-10-22',
    startTime: '08:00',
    endTime: '16:00',
    description: 'Participación en ExpoProfesiones Mexicali (Día 2). Horario: 8:00 a 16:00 h ambos días.',
    category: 'Académico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 4,
      actualAttendees: undefined,
      delegationNames: ['Comitiva de Expositores UABC'],
      notes: 'Segundo día de atención en ExpoProfesiones Mexicali de 8:00 a 16:00 h.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#8b5cf6',
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z'
  },
  {
    id: 'evt-expo-profesiones-ensenada-2026-dia23',
    title: 'ExpoProfesiones Ensenada',
    organizer: 'UABC',
    location: 'Ensenada',
    date: '2026-10-23',
    startTime: '08:00',
    endTime: '16:00',
    description: `Participación en ExpoProfesiones Ensenada el 23 de octubre.
Horarios y turnos de atención programados:
• 8:00 a 11:00 h
• 11:00 a 13:30 h
• 13:30 a 16:00 h`,
    category: 'Académico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 6,
      actualAttendees: undefined,
      delegationNames: ['Comitiva de Expositores FCM y UABC Ensenada'],
      notes: 'Turnos: 8:00 a 11:00 h / 11:00 a 13:30 h / 13:30 a 16:00 h.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#0284c7',
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z'
  },
  {
    id: 'evt-noche-de-las-estrellas-2026',
    title: 'Noche de las Estrellas 2026',
    organizer: 'Instituto de Astronomía Ensenada (IAE) / OAN-SPM',
    location: 'Caracol Museo de Ciencias de Ensenada Baja California',
    date: '2026-11-14',
    startTime: '15:00',
    endTime: '21:00',
    description: `A la comunidad del Instituto de Astronomía Ensenada (IAE), del Observatorio Astronómico Nacional de San Pedro Mártir (OAN-SPM), así como a estudiantes, docentes, personal de instituciones educativas, colectivos, asociaciones y organizaciones de divulgación científica de Ensenada, Baja California y de la región, a participar en la Noche de las Estrellas 2026, con actividades de divulgación que se presentarán el sábado 14 de noviembre, de 15:00 a 21:00 horas, en el Caracol Museo de Ciencias de Ensenada Baja California.

Temática 2026:
• 75 aniversario del descubrimiento de la radiación de 21 cm del hidrógeno
• 20 aniversario de la definición de planeta por la IAU
• 115 aniversario del nacimiento de Paris Pismis
• 200 años de las relaciones diplomáticas México-Francia`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 15,
      actualAttendees: undefined,
      delegationNames: [
        'Instituto de Astronomía Ensenada (IAE)',
        'Observatorio Astronómico Nacional San Pedro Mártir (OAN-SPM)',
        'Caracol Museo de Ciencias',
        'Estudiantes, docentes y colectivos de divulgación'
      ],
      notes: 'Módulos y talleres de divulgación astronómica conmemorando los aniversarios temáticos de 2026.'
    },
    reminder: {
      enabled: true,
      timing: '2_days',
      notified: false
    },
    badgeColor: '#4f46e5',
    createdAt: '2026-09-30T08:14:00Z',
    updatedAt: '2026-09-30T08:14:00Z'
  },
  {
    id: 'evt-semana-ciencia-cetis074-2026-dia1',
    title: 'Semana de Ciencia y Tecnología del CETis 074 - Día 1',
    organizer: 'CETis 074 / Biotecnología en Acuacultura (FCM - UABC)',
    location: 'Instalaciones del CETis 074',
    date: '2026-10-19',
    startTime: '11:00',
    endTime: '14:00',
    description: `Semana de Ciencia y Tecnología del CETis 074, donde tendremos la oportunidad de dar a conocer algunos de los proyectos que desarrollamos en Biotecnología en Acuacultura y, al mismo tiempo, despertar el interés de los jóvenes por nuestra carrera.

Horario de actividad: lunes 19 y martes 20 de octubre, de 11:00 a 14:00 horas (con montaje a las 10:00 horas).`,
    additionalNotes: `• Contexto científico: Presentación y divulgación de proyectos desarrollados en Biotecnología en Acuacultura y promoción vocacional de la licenciatura.
• Logística específica: Montaje a las 10:00 horas; atención a estudiantes de 11:00 a 14:00 horas.`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 6,
      actualAttendees: undefined,
      delegationNames: ['Docentes y Estudiantes de Biotecnología en Acuacultura'],
      notes: 'Primer día (lunes 19 de octubre). Montaje a las 10:00 horas; exposición de 11:00 a 14:00 horas.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#0d9488',
    createdAt: '2026-10-08T11:52:00Z',
    updatedAt: '2026-10-08T11:52:00Z'
  },
  {
    id: 'evt-semana-ciencia-cetis074-2026-dia2',
    title: 'Semana de Ciencia y Tecnología del CETis 074 - Día 2',
    organizer: 'CETis 074 / Biotecnología en Acuacultura (FCM - UABC)',
    location: 'Instalaciones del CETis 074',
    date: '2026-10-20',
    startTime: '11:00',
    endTime: '14:00',
    description: `Semana de Ciencia y Tecnología del CETis 074, donde tendremos la oportunidad de dar a conocer algunos de los proyectos que desarrollamos en Biotecnología en Acuacultura y, al mismo tiempo, despertar el interés de los jóvenes por nuestra carrera.

Horario de actividad: lunes 19 y martes 20 de octubre, de 11:00 a 14:00 horas (con montaje a las 10:00 horas).`,
    additionalNotes: `• Contexto científico: Presentación y divulgación de proyectos desarrollados en Biotecnología en Acuacultura y promoción vocacional de la licenciatura.
• Logística específica: Montaje a las 10:00 horas; atención a estudiantes de 11:00 a 14:00 horas.`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 6,
      actualAttendees: undefined,
      delegationNames: ['Docentes y Estudiantes de Biotecnología en Acuacultura'],
      notes: 'Segundo día (martes 20 de octubre). Montaje a las 10:00 horas; exposición de 11:00 a 14:00 horas.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#0d9488',
    createdAt: '2026-10-08T11:52:00Z',
    updatedAt: '2026-10-08T11:52:00Z'
  },
  {
    id: 'evt-potenciales-a-egresar-2026',
    title: 'Ceremonia de Potenciales a Egresar',
    organizer: 'UABC / Facultad de Ciencias Marinas (FCM)',
    location: 'Por confirmar (Tradicionalmente: Gimnasio de Valle Dorado)',
    date: '2026-11-25',
    startTime: '09:00',
    endTime: '12:00',
    description: `La ceremonia de potenciales a egresar se realizará el miércoles 25 de noviembre. El lugar y la hora quedan pendientes. Tradicionalmente, se nos cita en el gimnasio de Valle Dorado a las 9:00 a.m.

En la ceremonia se solicita que vayan únicamente los estudiantes. Cada facultad lleva una camisa de vestir de diferente color. A la FCM nos corresponde en color azul marino.`,
    additionalNotes: `• Lugar y hora: Quedan pendientes de confirmación oficial (tradicionalmente se cita en el Gimnasio de Valle Dorado a las 9:00 a.m.).
• Asistencia: Se solicita que acudan únicamente los estudiantes potenciales a egresar.
• Código de vestimenta: Cada facultad lleva una camisa de vestir de diferente color. A la Facultad de Ciencias Marinas (FCM) le corresponde camisa de vestir en color azul marino.`,
    category: 'Institucional',
    status: 'pendiente',
    attendance: {
      projectedAttendees: 30,
      actualAttendees: undefined,
      delegationNames: ['Estudiantes Potenciales a Egresar - FCM'],
      notes: 'Únicamente estudiantes. Camisa de vestir color azul marino (distintivo FCM). Cita tradicional: 9:00 a.m. en el Gimnasio de Valle Dorado (lugar y hora oficiales por confirmar).'
    },
    reminder: {
      enabled: true,
      timing: '2_days',
      notified: false
    },
    badgeColor: '#1e3a8a',
    createdAt: '2026-10-09T17:53:00Z',
    updatedAt: '2026-10-09T17:53:00Z'
  },
  {
    id: 'evt-xli-encuentro-divulgacion-cientifica-2026-dia1',
    title: 'XLI Encuentro Nacional de Divulgación Científica - Día 1',
    organizer: 'Sociedad Mexicana de Física (SMF) / Congreso Nacional de Física',
    location: 'Museo Caracol, Ensenada',
    date: '2026-10-12',
    startTime: '09:00',
    endTime: '17:00',
    description: `XLI Encuentro Nacional de Divulgación Científica que se celebrará del lunes 12 al viernes 15 de octubre en el Museo Caracol.

El Encuentro es parte del Congreso Nacional de Física que se celebrará en las mismas fechas en Ensenada, siendo un evento satélite de la Sociedad Mexicana de Física.`,
    additionalNotes: `• Contexto científico: Evento satélite de la Sociedad Mexicana de Física (SMF), parte del Congreso Nacional de Física celebrado en las mismas fechas en Ensenada.
• Sede: Museo Caracol, Ensenada.
• Fechas: Del 12 al 15 de octubre de 2026.`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 10,
      actualAttendees: undefined,
      delegationNames: ['Sociedad Mexicana de Física (SMF)', 'Comunidad de Divulgación Científica'],
      notes: 'Día 1 (12 de octubre). Evento satélite del Congreso Nacional de Física en el Museo Caracol.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#2563eb',
    createdAt: '2026-10-09T20:15:00Z',
    updatedAt: '2026-10-09T20:15:00Z'
  },
  {
    id: 'evt-xli-encuentro-divulgacion-cientifica-2026-dia2',
    title: 'XLI Encuentro Nacional de Divulgación Científica - Día 2',
    organizer: 'Sociedad Mexicana de Física (SMF) / Congreso Nacional de Física',
    location: 'Museo Caracol, Ensenada',
    date: '2026-10-13',
    startTime: '09:00',
    endTime: '17:00',
    description: `XLI Encuentro Nacional de Divulgación Científica que se celebrará del lunes 12 al viernes 15 de octubre en el Museo Caracol.

El Encuentro es parte del Congreso Nacional de Física que se celebrará en las mismas fechas en Ensenada, siendo un evento satélite de la Sociedad Mexicana de Física.`,
    additionalNotes: `• Contexto científico: Evento satélite de la Sociedad Mexicana de Física (SMF), parte del Congreso Nacional de Física celebrado en las mismas fechas en Ensenada.
• Sede: Museo Caracol, Ensenada.
• Fechas: Del 12 al 15 de octubre de 2026.`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 10,
      actualAttendees: undefined,
      delegationNames: ['Sociedad Mexicana de Física (SMF)', 'Comunidad de Divulgación Científica'],
      notes: 'Día 2 (13 de octubre). Evento satélite del Congreso Nacional de Física en el Museo Caracol.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#2563eb',
    createdAt: '2026-10-09T20:15:00Z',
    updatedAt: '2026-10-09T20:15:00Z'
  },
  {
    id: 'evt-xli-encuentro-divulgacion-cientifica-2026-dia3',
    title: 'XLI Encuentro Nacional de Divulgación Científica - Día 3',
    organizer: 'Sociedad Mexicana de Física (SMF) / Congreso Nacional de Física',
    location: 'Museo Caracol, Ensenada',
    date: '2026-10-14',
    startTime: '09:00',
    endTime: '17:00',
    description: `XLI Encuentro Nacional de Divulgación Científica que se celebrará del lunes 12 al viernes 15 de octubre en el Museo Caracol.

El Encuentro es parte del Congreso Nacional de Física que se celebrará en las mismas fechas en Ensenada, siendo un evento satélite de la Sociedad Mexicana de Física.`,
    additionalNotes: `• Contexto científico: Evento satélite de la Sociedad Mexicana de Física (SMF), parte del Congreso Nacional de Física celebrado en las mismas fechas en Ensenada.
• Sede: Museo Caracol, Ensenada.
• Fechas: Del 12 al 15 de octubre de 2026.`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 10,
      actualAttendees: undefined,
      delegationNames: ['Sociedad Mexicana de Física (SMF)', 'Comunidad de Divulgación Científica'],
      notes: 'Día 3 (14 de octubre). Evento satélite del Congreso Nacional de Física en el Museo Caracol.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#2563eb',
    createdAt: '2026-10-09T20:15:00Z',
    updatedAt: '2026-10-09T20:15:00Z'
  },
  {
    id: 'evt-xli-encuentro-divulgacion-cientifica-2026-dia4',
    title: 'XLI Encuentro Nacional de Divulgación Científica - Día 4',
    organizer: 'Sociedad Mexicana de Física (SMF) / Congreso Nacional de Física',
    location: 'Museo Caracol, Ensenada',
    date: '2026-10-15',
    startTime: '09:00',
    endTime: '17:00',
    description: `XLI Encuentro Nacional de Divulgación Científica que se celebrará del lunes 12 al viernes 15 de octubre en el Museo Caracol.

El Encuentro es parte del Congreso Nacional de Física que se celebrará en las mismas fechas en Ensenada, siendo un evento satélite de la Sociedad Mexicana de Física.`,
    additionalNotes: `• Contexto científico: Evento satélite de la Sociedad Mexicana de Física (SMF), parte del Congreso Nacional de Física celebrado en las mismas fechas en Ensenada.
• Sede: Museo Caracol, Ensenada.
• Fechas: Del 12 al 15 de octubre de 2026.`,
    category: 'Científico',
    status: 'confirmado',
    attendance: {
      projectedAttendees: 10,
      actualAttendees: undefined,
      delegationNames: ['Sociedad Mexicana de Física (SMF)', 'Comunidad de Divulgación Científica'],
      notes: 'Día 4 y clausura (15 de octubre). Evento satélite del Congreso Nacional de Física en el Museo Caracol.'
    },
    reminder: {
      enabled: true,
      timing: '1_day',
      notified: false
    },
    badgeColor: '#2563eb',
    createdAt: '2026-10-09T20:15:00Z',
    updatedAt: '2026-10-09T20:15:00Z'
  }
];

