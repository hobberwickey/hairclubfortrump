class Application < Sinatra::Base
  helpers do
    def make_paperclip_mash(file_hash)
      mash = Hash.new
      mash['tempfile'] = file_hash[:tempfile]
      mash['filename'] = file_hash[:filename]
      mash['content_type'] = file_hash[:type]
      mash['size'] = file_hash[:tempfile].size
      puts "MASH: #{mash.to_json}"
      mash
    end
  end
end
