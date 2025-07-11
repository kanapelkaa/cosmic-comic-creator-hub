
# Local Network Setup

To access your comics site via `comics.com` on your local network:

## Method 1: Hosts File (Recommended)
1. Edit the hosts file on each device:
   - **Windows**: `C:\Windows\System32\drivers\etc\hosts`
   - **Mac/Linux**: `/etc/hosts`
   
2. Add this line (replace with your actual IP):
   ```
   192.168.1.100 comics.com
   ```

3. Access via `http://comics.com:8080`

## Method 2: Router DNS Override
If your router supports it, add a DNS override for `comics.com` pointing to your server's IP.

## Finding Your IP Address
- **Windows**: Run `ipconfig` in command prompt
- **Mac/Linux**: Run `ifconfig` or `ip addr show`

## Starting the Server
The server is now configured to accept connections from any IP address on your network.

## Syncing Comics
Comics are now synchronized across all devices accessing the same server instance. When you create a comic on one device, it will be available on all other devices connected to the same server.
