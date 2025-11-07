const ejerciciosIntermedios = [
  {
    code: `int puntos = 10;
System.out.println("Puntos iniciales: " + puntos);
puntos = 20;
System.out.println("Puntos despues: " + puntos);`,
    description: "Demuestra cómo reasignar variables enteras y mostrar sus valores antes y después."
  },
  {
    code: `int a = 5;
int b = 3;
System.out.println("La suma es: " + (a + b));`,
    description: "Ejemplo de suma entre dos números enteros."
  },
  {
    code: `double precio = 9.99;
System.out.println("Precio inicial: " + precio);
precio = 7.50;
System.out.println("Precio con descuento: " + precio);`,
    description: "Ejemplo de actualización de una variable double y su impresión en consola."
  },
  {
    code: `String ciudad = "Bogota";
System.out.println("Ciudad actual: " + ciudad);
ciudad = "Medellin";
System.out.println("Ciudad cambiada: " + ciudad);`,
    description: "Ejemplo de reasignación de variables String."
  },
  {
    code: `int x = 10;
int y = 5;
System.out.println("Diferencia: " + (x - y));`,
    description: "Ejemplo de resta de enteros."
  },
  {
    code: `String saludo = "Hola";
saludo = "Adios";
System.out.println(saludo);`,
    description: "Ejemplo de reasignación de texto en variables String."
  },
  {
    code: `int valor = 4;
valor = valor * 2;
System.out.println("Valor modificado: " + valor);`,
    description: "Ejemplo de multiplicación y reasignación de enteros."
  },
  {
    code: `boolean activo = false;
System.out.println("Estado inicial: " + activo);
activo = true;
System.out.println("Estado final: " + activo);`,
    description: "Ejemplo de modificación de valores booleanos."
  },
  {
    code: `int base = 6;
int altura = 2;
System.out.println("Area: " + (base * altura));`,
    description: "Cálculo de área de un rectángulo simple."
  },
  {
    code: `double nota = 3.5;
nota = nota + 1.0;
System.out.println("Nota final: " + nota);`,
    description: "Ejemplo de incremento de una variable double."
  },
  {
    code: `String lenguaje = "Java";
System.out.println("Lenguaje inicial: " + lenguaje);
lenguaje = "Python";
System.out.println("Lenguaje cambiado: " + lenguaje);`,
    description: "Ejemplo de cambio de valor en variables String."
  },
  {
    code: `int horas = 2;
int minutos = horas * 60;
System.out.println("Minutos: " + minutos);`,
    description: "Conversión de horas a minutos."
  }
];

export { ejerciciosIntermedios };
