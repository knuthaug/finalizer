#!/usr/bin/perl
while (<>) {
    chomp;
    @parts = split /;/; 
    s/"//g for @parts;
    s/\.//g for @parts;
    s/\r\n/\n/g for @parts;
    @time = split /-/, $parts[0]; 

    if (index($parts[3], "-") != -1) { 
        $parts[3] = substr($parts[3], 1);
        print "$time[0].$time[1].$time[2]\t$parts[2]\t$parts[3]\n";
    } else { 
        print "$time[0].$time[1].$time[2]\t$parts[2]\t\t$parts[4]\n";
    }
}
