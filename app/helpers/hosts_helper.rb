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

end
