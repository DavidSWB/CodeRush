const ejerciciosAvanzados = [
  {
    code: `int a = 8;
int b = 4;
int resultado = a * b;
System.out.println("El producto es: " + resultado);`,
    description: "Ejemplo de multiplicación entre enteros y su impresión."
  },
  {
    code: `String nombre = "Laura";
boolean aprobado = true;
System.out.println("Estudiante: " + nombre + " Aprobado: " + aprobado);`,
    description: "Combina texto y booleanos en una impresión."
  },
  {
    code: `double base = 5.5;
double altura = 3.2;
System.out.println("Area del rectangulo: " + (base * altura));`,
    description: "Cálculo del área de un rectángulo usando double."
  },
  {
    code: `char inicial = "D";
String apellido = "Martinez";
System.out.println("Inicial: " + inicial + " Apellido: " + apellido);`,
    description: "Ejemplo de concatenación de un carácter y un String."
  },
  {
    code: `int x = 12;
int y = 6;
System.out.println("Division: " + (x / y));`,
    description: "Ejemplo de división de enteros."
  },
  {
    code: `String mensaje = "Java";
boolean esDivertido = true;
System.out.println(mensaje + " es " + esDivertido);`,
    description: "Combina un String y un booleano en una salida."
  },
  {
    code: `int numero1 = 15;
int numero2 = 7;
int suma = numero1 + numero2;
int resta = numero1 - numero2;
System.out.println("Suma: " + suma + " Resta: " + resta);`,
    description: "Operaciones de suma y resta entre enteros."
  },
  {
    code: `double radio = 4.5;
double areaCirculo = 3.14 * radio * radio;
System.out.println("Area del circulo: " + areaCirculo);`,
    description: "Cálculo del área de un círculo usando la fórmula πr²."
  },
  {
    code: `String producto = "Manzana";
double precio = 2.5;
int cantidad = 4;
System.out.println("Producto: " + producto + " Total: " + (precio * cantidad));`,
    description: "Ejemplo de multiplicación de precio y cantidad para obtener el total."
  },
  {
    code: `char letra1 = "A";
char letra2 = "B";
System.out.println("Secuencia: " + letra1 + ", " + letra2);`,
    description: "Concatenación de dos caracteres."
  },
  {
    code: `int ancho = 5;
int alto = 10;
int perimetro = 2 * (ancho + alto);
System.out.println("Perimetro del rectangulo: " + perimetro);`,
    description: "Cálculo del perímetro de un rectángulo."
  },
  {
    code: `String nombre1 = "Carlos";
String nombre2 = "Maria";
System.out.println("Participantes: " + nombre1 + " y " + nombre2);`,
    description: "Concatenación de dos Strings para mostrar participantes."
  }
];

export { ejerciciosAvanzados };
