#include<iostream>
#include<fstream>
using namespace std;
int main(){ofstream f("/etc/test.txt"); if(f){cout<<"WRITE_SUCCESS";} else {cout<<"WRITE_FAILED";}}