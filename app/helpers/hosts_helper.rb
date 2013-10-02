module HostsHelper

  def extract_ips(addr_infos)
    ips = ""
    if !addr_infos.empty?
        addr_infos.each do |info|
        ips += " #{info[:addr]}"
      end
    end
    ips
  end

  def getServerIPs(server, type=:all)
    ips = ""
    server.nets.each do |n|
      n.addresses.each do |a|
        if type == "all" || a.attributes["OS-EXT-IPS:type"] == type
          ips += " #{a.addr}"
        end
      end
    end
    ips
  end

end
