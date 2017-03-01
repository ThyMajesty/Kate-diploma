function CalculateLorenzIComponent( x, y, t)
{
     I = t * ((-g * x) + (g * y));
    return I;
}
function CalculateLorenzJComponent( x, y, z, t)
{
     K = t * ((r * x) - y - (x * z));
    return K;
}
function CalculateLorenzKComponent( x, y, z, t)
{
     L = t * ((x * y) - (b * z));
    return L;
}




function LorencRoutine(n)
{
    for (n = 0; n < _iterations; n++)
{
    //приближение 1-го порядка
    I1 = CalculateLorenzIComponent(X1, Y1, T1);
    J1 = CalculateLorenzJComponent(X1, Y1, Z1, T1);
    K1 = CalculateLorenzKComponent(X1, Y1, Z1, T1);

    //приближение 2-го порядка
    I2 = CalculateLorenzIComponent(X1 + (h / 2) * I1, Y1 + (h / 2) * J1, T1 + (h / 2));
    J2 = CalculateLorenzJComponent(X1 + (h / 2) * 
        I1, Y1 + (h / 2) * J1, Z1 + (h / 2) * K1, T1 + h / 2);
    K2 = CalculateLorenzKComponent(X1 + (h / 2) * 
        I1, Y1 + (h / 2) * J1, Z1 + (h / 2) * K1, T1 + (h / 2));
    
    //приближение 3-го порядка
    I3 = CalculateLorenzIComponent(X1 + (h / 2) * I2, Y1 + (h / 2) * J2, T1 + h / 2);
    J3 = CalculateLorenzJComponent(X1 + (h / 2) * 
        I2, Y1 + (h / 2) * J2, Z1 + (h / 2) * K1, T1 + (h / 2));
    K3 = CalculateLorenzKComponent(X1 + (h / 2) * 
        I2, X1 + (h / 2) * J2, Z1 + (h / 2) * K1, T1 + (h / 2));
 
    //приближение 4-го порядка
    I4 = CalculateLorenzIComponent(X1 + (h / 2) * I3, Y1 + (h / 2) * J3, T1 + (h / 2));
    J4 = CalculateLorenzJComponent(X1 + (h / 2) * 
        I3, Y1 + (h / 2) * J3, Z1 + (h / 2) * K1, T1 + (h / 2));
    K4 = CalculateLorenzKComponent(X1 + (h / 2) * 
        I3, X1 + (h / 2) * J3, Z1 + (h / 2) * K1, T1 + (h / 2));
   
    //Расширение ряда Тейлора в 3-х размерностях
    float X2 = X1 + (h / 6) * (I1 + 2 * I2 + 2 * I3 + I4);
    float Y2 = Y1 + (h / 6) * (J1 + 2 * J2 + 2 * J3 + J4);
    float Z2 = Z1 + (h / 6) * (K1 + 2 * K2 + 2 * K3 + J4);
  
    if (n > 0)    {
        new Point3D(X2, Y2, Z2), 1, 0x000000,

        BuildVector3D(new Point3D(X1, Y1, Z1),  100, 0x000000, 100);
    }
  
    X1 = X2;
    Y1 = Y2;
    Z1 = Z2;
}
}