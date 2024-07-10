export interface Foro {
  id?: string;
  subtopicId?: string
  pregunta?: string;
  comentarios?: {
    nombreUsuario?: string;
    correoUsuario?: string;
    respuesta?: string;
};
}
